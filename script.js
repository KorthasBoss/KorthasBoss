/*
==========================================================
 YEN! // BOSS WORLD // MAIN ENGINE
==========================================================
This file is the shared battle engine only.

Boss-specific rules live in:
  bosses/korthas.js
  bosses/argus.js
  bosses/azael.js

A new boss should get its own file and expose a boss object with hooks.
The engine never copies one boss's combat rules into another boss.
==========================================================
*/

const CONFIG = {
  background: "assets/79909.gif",
  accountStartingDox: 500000,
  bosses: window.YEN_BOSSES || {},
  merchant: {
    image: "assets/Merchant_Idle.png",
    background: "assets/Merchant_background.gif",
    music: "assets/merchant-theme.mp3",
    lines: [
      "Oh you're back.","Welcome back, hunter.","You look like somebody who needs a better skill.","I don't ask where you got that DOX.","You survived. That's enough for me.","The vault is open. Try not to go broke.","I've seen your type before.","You fight loud. I sell louder.","Pick something nasty.","Some skills bite back.","Enchanted ones cost what they cost.","Don't stare at the price. Earn more.","You want power? Pay for it.","I keep the good stuff behind the expensive stuff.","A cheap skill can still save your life.","A rare skill can ruin somebody else's.","The vault has eight thousand answers.","You only need one.","Unless you're greedy.","Greedy is fine here.","That one? Interesting choice.","I wouldn't use it against Argus first.","Korthas hates flashy skills.","Argus hates everything.","The enchanted stock is temperamental.","Buy before the price feels worse.","You came back with more DOX.","Now you're speaking my language.","A hunter without skills is just target practice.","A hunter with too many skills is expensive target practice.","I've got something mean today.","I've got something beautiful today.","I've got something that should probably be illegal.","Relax. It's only a game.","Probably.","You want the vault? Hit the button.","Don't make me repeat myself.","The good stuff is glowing for a reason.","That purple glow means trouble.","The gold ones hurt wallets.","The red ones hurt bosses.","The blue ones save mistakes.","Buy wisely.","Or don't. I still get paid.","You look ready.","You're almost dangerous.","Almost.","Come back after another boss.","I'll have more bad ideas waiting.","Now go make me proud.","Welcome back, hunter."
    ]
  }
};

const $ = id => document.getElementById(id);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const pick = a => a[Math.floor(Math.random() * a.length)];
const randomInt = (a,b) => Math.floor(Math.random() * (b-a+1)) + a;

function toDox(value) {
  try {
    if (typeof value === "bigint") return value < 0n ? 0n : value;
    const text = String(value ?? "0").replace(/,/g, "").trim();
    if (!/^\d+$/.test(text)) return 0n;
    return BigInt(text);
  } catch { return 0n; }
}
function fmtDox(value) { return toDox(value).toLocaleString("en-US"); }
function fmt(value) { return Math.max(0, Math.floor(Number(value) || 0)).toLocaleString("en-US"); }

let account = null;
let currentBoss = null;
let pendingBoss = null;
let bossHP = 0;
let bossShield = 0;
let playerHP = 0;
let bossAttackEnabled = false;
let busy = false;
let battleFinished = false;
let encounterNumber = 0;
let merchantIndex = 0;
let skillCatalog = null;
let selectedSkill = null;
let cooldowns = new Map();
let brokenAttackIds = new Set();
let lastPlayerDamage = 0;

const settings = JSON.parse(localStorage.getItem("yen_settings") || '{"effects":true,"music":true,"motion":false}');

function setMessage(text) { $("battle-message").textContent = text; }
function setPhaseLabel(text) { $("phase-label").textContent = text; }
function showFlash() {
  if (!settings.effects) return;
  const el = document.createElement("div");
  el.className = "flash-white";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
}
function shake() {
  if (!settings.effects) return;
  const game = $("game");
  game.classList.remove("shake-screen");
  void game.offsetWidth;
  game.classList.add("shake-screen");
}
function setBackground(path, fallback) {
  document.body.style.backgroundImage = fallback || "radial-gradient(ellipse at 50% 0%,#17243d,#090d17 45%,#05060b)";
  if (!path) return;
  const image = new Image();
  image.onload = () => {
    document.body.style.backgroundImage = `linear-gradient(#03050a99,#03040ae6),url("${path}")`;
  };
  image.onerror = () => console.warn("Background asset could not load:", path);
  image.src = path;
}

/* Never fade character art because an asset fails. */
function setCharacter(id, path) {
  const el = $(id);
  if (!el) return;
  el.style.opacity = "1";
  el.style.visibility = "visible";
  el.onerror = () => {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    console.warn("Character asset could not load:", path);
  };
  el.src = path;
}

function playAudio(src, volume=.7, restart=true, waitForEnd=false) {
  if (!settings.music || !src) return Promise.resolve();
  const audio = new Audio(src);
  audio.volume = volume;
  if (restart) audio.currentTime = 0;
  document.body.appendChild(audio);
  return new Promise(resolve => {
    let finished = false;
    const finish = () => { if (finished) return; finished=true; audio.remove(); resolve(); };
    audio.addEventListener("ended", finish, {once:true});
    audio.addEventListener("error", finish, {once:true});
    audio.play().catch(finish);
    if (!waitForEnd) setTimeout(finish, 180);
  });
}

function showSaveWarning(message) {
  let toast = $("yen-save-warning");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yen-save-warning";
    toast.className = "yen-save-warning";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.style.display="none", 2800);
}

/* Static account mode: nothing is written back to accounts.js. */
async function saveAccount() { return true; }

async function transition(fn) {
  const overlay = document.createElement("div");
  overlay.className = "fade-transition";
  document.body.appendChild(overlay);
  await wait(180);
  await fn();
  await wait(140);
  overlay.remove();
}

function showScreen(id) {
  document.querySelectorAll(".portal-screen,.portal-subscreen,.battle-screen").forEach(x => x.classList.add("hidden"));
  $(id)?.classList.remove("hidden");
  setPhaseLabel(id === "lobby-screen" ? "HUNTER LOBBY" : id === "merchant-screen" ? "MERCHANT // OPEN" : id === "start-screen" ? "WELCOME" : "YEN! // READY");
}

function updateWallet() {
  if (!account) return;
  $("wallet-dox").textContent = fmtDox(account.dox);
  $("battle-dox").textContent = fmtDox(account.dox);
}

function bossCard(boss) {
  const el = document.createElement("article");
  const isProfileBoss = Boolean(boss.profileFrame);
  const profileClass = isProfileBoss ? "profile-frame-card" : "";
  el.className = `boss-card ${profileClass}`;
  el.style.setProperty("--card-bg", `url("${boss.cardImage || boss.idle}")`);

  if (isProfileBoss) {
    // Profile-frame bosses keep the normal clickable card, while the supplied
    // artwork sits OUTSIDE the card as an ornamental profile frame.
    el.innerHTML = `<div class="boss-card-bg"></div>
      <div class="profile-frame-wrap" aria-hidden="true"><img class="profile-card-frame" src="${boss.profileFrame}" alt=""></div>
      <div class="boss-card-badge">BOSS // ${String(boss.stars).padStart(2,"0")} ★</div>
      <img class="boss-card-art profile-card-character" src="${boss.idle}" alt="${boss.name} idle">
      <div class="boss-card-info"><div class="stars">${"★".repeat(8)} ${boss.stars} STARS</div><h2>${boss.name}</h2><p>${boss.title} // REWARD ${fmtDox(boss.reward)} DOX</p></div>`;
  } else {
    el.innerHTML = `<div class="boss-card-bg"></div>
      <div class="boss-card-badge">BOSS // ${String(boss.stars).padStart(2,"0")} ★</div>
      <img class="boss-card-art" src="${boss.idle}" alt="${boss.name} idle">
      <div class="boss-card-info"><div class="stars">${"★".repeat(Math.min(8,Math.ceil(boss.stars/10)))} ${boss.stars} STARS</div><h2>${boss.name}</h2><p>${boss.title} // REWARD ${fmtDox(boss.reward)} DOX</p></div>`;
  }

  el.addEventListener("click", () => askBoss(boss));
  return el;
}

function renderLobby() {
  $("boss-music").pause();
  document.body.classList.remove("azael-domain");
  setBackground("assets/lobby-background.jpg");
  updateWallet();
  const list = $("boss-list");
  list.innerHTML = "";
  Object.values(CONFIG.bosses).forEach(boss => list.appendChild(bossCard(boss)));
  const merchant = document.createElement("article");
  merchant.className = "boss-card merchant-lobby-card";
  merchant.innerHTML = `<div class="boss-card-bg" style="background-image:url('${CONFIG.merchant.background}')"></div><div class="boss-card-badge">MERCHANT // SAFE</div><img class="boss-card-art" src="${CONFIG.merchant.image}" alt="Merchant"><div class="boss-card-info"><div class="stars">8,001 SKILLS IN STOCK</div><h2>MERCHANT</h2><p>NO THREAT // CUSTOM DIALOGUE // SKILL VAULT</p></div>`;
  merchant.addEventListener("click", async () => { await transition(() => showScreen("merchant-screen")); openMerchant(); });
  list.appendChild(merchant);
}

function askBoss(boss) {
  pendingBoss = boss;
  $("confirm-title").textContent = `FIGHT ${boss.name}?`;
  $("confirm-copy").textContent = `Are you sure you want to fight ${boss.name}? It has ${boss.stars} stars.`;
  $("confirm-screen").classList.remove("hidden");
}

/* ------------------------- ACCOUNTS ------------------------- */
async function registerOrLogin() {
  const username = $("auth-username").value.trim();
  const password = $("auth-password").value;
  $("auth-status").textContent = "";
  const accounts = Array.isArray(window.YEN_ACCOUNTS) ? window.YEN_ACCOUNTS : [];
  const found = accounts.find(a => String(a.username || "").trim().toLowerCase() === username.toLowerCase() && String(a.password ?? "") === password);

  if (!found) {
    $("auth-status").textContent = accounts.length ? "That username or password is incorrect." : "No accounts are configured yet. Add an account in accounts.js first.";
    return;
  }

  account = {
    username: String(found.username),
    dox: toDox(found.dox),
    defeated: {},
    ownedSkills: Array.isArray(found.ownedSkills) ? found.ownedSkills.map(String) : [],
    attacks: Array.isArray(found.attacks) ? found.attacks.map((a,i) => ({
      id: String(a.id || `custom-${i}`),
      name: String(a.name || `CUSTOM ATTACK ${i+1}`),
      power: Math.max(1, Math.floor(Number(a.power) || 10000)),
      rarity: String(a.rarity || "CUSTOM"),
      color: String(a.color || "#ff5573"),
      description: String(a.description || "A custom account-only attack."),
      enchanted: Boolean(a.enchanted)
    })) : [],
    potions: found.potions && typeof found.potions === "object" ? Object.fromEntries(Object.entries(found.potions).map(([k,v])=>[k,Math.max(0,Math.floor(Number(v)||0))])) : {}
  };

  await transition(() => showScreen("lobby-screen"));
  renderLobby();
}
$("auth-form").addEventListener("submit", e => { e.preventDefault(); registerOrLogin(); });

document.querySelectorAll("[data-screen]").forEach(button => button.addEventListener("click", async () => {
  const id = button.dataset.screen;
  if (id === "lobby-screen" && !account) { showScreen("auth-screen"); return; }
  await transition(() => showScreen(id));
  if (id === "merchant-screen") openMerchant();
  if (id === "lobby-screen") renderLobby();
}));

$("brand-home").addEventListener("click", async e => {
  e.preventDefault();
  if (account) { await transition(() => showScreen("lobby-screen")); renderLobby(); }
  else showScreen("start-screen");
});
$("logout-button").addEventListener("click", async () => {
  account = null;
  await transition(() => showScreen("start-screen"));
});

/* ------------------------- MERCHANT ------------------------- */
function buildSkillCatalog() {
  if (skillCatalog) return skillCatalog;
  const prefixes = ["Void","Astral","Dread","Soul","Rune","Blood","Echo","Fallen","Solar","Night","Grave","Tome","Royal","Phantom","Seraph","Ruin","Star","Cursed","Abyssal","Thorn"];
    
  const cores = ["Slash","Burst","Pierce","Nova","Judgment","Wave","Prism","Chain","Rift","Pulse","Meteor","Brand","Requiem","Tempest","Execution","Sigil","Crash","Sunder","Fang","Cannon"];
  const rarities = [
    {name:"COMMON",count:1600,color:"#7e94ae",mult:1,cost:[12000,70000]},
    {name:"RARE",count:1000,color:"#54cfff",mult:1.25,cost:[70000,250000]},
    {name:"EPIC",count:700,color:"#bd72ff",mult:1.7,cost:[250000,900000]},
    {name:"LEGENDARY",count:500,color:"#ffb84e",mult:2.4,cost:[900000,3500000]},
    {name:"MYTHIC",count:200,color:"#ff5573",mult:3.2,cost:[3500000,10000000]},
    {name:"ENCHANTED",count:4000,color:"#f6b4ff",mult:8.5,cost:[25000000,500000000]}
  ];
  let id = 0;
  const output = [];
  rarities.forEach(rarity => {
    for (let i=0;i<rarity.count;i++) {
      const name = `${prefixes[(id*7)%prefixes.length]} ${cores[(id*11+i)%cores.length]} ${String(i+1).padStart(3,"0")}`;
      const seed = (id * 1103515245 + 12345) >>> 0;
      const ratio = seed / 4294967296;
      const powerMin = rarity.name === "ENCHANTED" ? 90000 : 9000;
      const powerMax = rarity.name === "ENCHANTED" ? 220000 : 60000;
      const power = Math.round((powerMin + (powerMax - powerMin) * ratio) * rarity.mult);
      const cost = Math.floor(rarity.cost[0] + (rarity.cost[1] - rarity.cost[0]) * ratio);
      output.push({
        id:String(id), name, rarity:rarity.name, color:rarity.color, enchanted:rarity.name === "ENCHANTED", cost, power,
        description: rarity.name === "ENCHANTED" ? `ENCHANTED ENDGAME SKILL. Deals around ${fmt(power)} damage. Extremely expensive and built to hurt bosses.` : `A ${rarity.name.toLowerCase()} skill. Deals around ${fmt(power)} damage when it lands.`
      });
      id++;
    }
  });
  output.push({
    id:"win-can-make-sword",
    name:"WIN CAN MAKE SWORD",
    rarity:"DIVINE // CUSTOM",
    color:"#ffffff",
    enchanted:true,
    rainbow:true,
    special:"rainbow-sword",
    breakChance:0.01,
    cost:80000000,
    power:79000,
    description:"A forbidden rainbow blade. Deals exactly 200,000 damage and has a 4% chance to shatter after use."
  });
  skillCatalog = output;
  return output;
}

const POTIONS = [
  {id:"minor",name:"MINOR HEALING POTION",heal:25000,cost:25000,description:"Restores 25,000 HP."},
  {id:"greater",name:"GREATER HEALING POTION",heal:60000,cost:125000,description:"Restores 60,000 HP."},
  {id:"soul",name:"SOUL FLASK",heal:110000,cost:450000,description:"Restores 110,000 HP."},
  {id:"royal",name:"ROYAL ELIXIR",heal:150000,cost:1500000,description:"Restores 150,000 HP."},
  {id:"immortal",name:"IMMORTAL DRAUGHT",heal:999999,cost:12000000,description:"Restores your entire soul."},
  {id:"crimson",name:"CRIMSON REPAIR",heal:130000,cost:900000,description:"Restores 130,000 HP."},
  {id:"void",name:"VOID HEART TONIC",heal:165000,cost:3000000,description:"Restores 165,000 HP."},
  {id:"divine",name:"DIVINE SOUL ELIXIR",heal:180000,cost:7500000,description:"Restores your full soul and can be used at critical health."},
  {id:"last",name:"LAST BREATH VIAL",heal:999999,cost:25000000,description:"A forbidden emergency potion. Restores your entire soul."}
];

function isSkillOwned(skill, owned=account?.ownedSkills||[]) {
  return owned.some(value => String(value) === String(skill.id) || String(value).trim().toLowerCase() === String(skill.name).trim().toLowerCase());
}
function findConfiguredSkill(value) {
  const key = String(value).trim();
  const catalog = buildSkillCatalog();
  return catalog.find(skill => String(skill.id) === key) || catalog.find(skill => skill.name.trim().toLowerCase() === key.toLowerCase()) || null;
}
function renderPotions() {
  const grid = $("potion-grid");
  if (!grid || !account) return;
  grid.innerHTML = "";
  account.potions = account.potions || {};
  POTIONS.forEach(potion => {
    const count = Number(account.potions[potion.id] || 0);
    const el = document.createElement("article");
    el.className = "potion-card";
    el.innerHTML = `<span class="potion-owned">OWNED: ${count}</span><div class="skill-rarity">HEALING // CONSUMABLE</div><h3>${potion.name}</h3><p>${potion.description}</p><div class="potion-price">${fmtDox(potion.cost)} DOX</div>`;
    el.onclick = () => {
      if (account.dox < BigInt(potion.cost)) { showSaveWarning("NOT ENOUGH DOX FOR THIS POTION."); return; }
      account.dox -= BigInt(potion.cost);
      account.potions[potion.id] = count + 1;
      updateWallet();
      renderPotions();
    };
    grid.appendChild(el);
  });
}
function openMerchant() {
  merchantIndex = 0;
  $("merchant-line").textContent = CONFIG.merchant.lines[0];
  $("merchant-dialog-count").textContent = "01 / 50";
  $("merchant-subline").textContent = "I've got something that'll make your next fight considerably less fair.";
  setCharacter("merchant-image",CONFIG.merchant.image);
  setBackground(CONFIG.merchant.background);
  if (settings.music) {
    const music = $("boss-music"); music.src=CONFIG.merchant.music; music.loop=true; music.volume=.4; music.play().catch(()=>{});
  }
  $("skill-shop").classList.add("hidden");
}
$("merchant-next").addEventListener("click", () => {
  merchantIndex = (merchantIndex + 1) % CONFIG.merchant.lines.length;
  $("merchant-line").textContent = CONFIG.merchant.lines[merchantIndex];
  $("merchant-dialog-count").textContent = `${String(merchantIndex+1).padStart(2,"0")} / 50`;
  $("merchant-subline").textContent = merchantIndex===49 ? "That's all fifty. The vault is yours. Pick your weapon." : merchantIndex%3===0 ? "The vault is still open. Pick something brutal." : "I've got 8,001 ways to make a boss regret meeting you.";
  if (merchantIndex===49) { buildSkillCatalog(); $("skill-shop").classList.remove("hidden"); renderSkills(); }
});
$("open-shop").addEventListener("click", () => { buildSkillCatalog(); $("skill-shop").classList.remove("hidden"); renderSkills(); });
$("skill-search").addEventListener("input", renderSkills);

function renderSkills() {
  renderPotions();
  const query = $("skill-search").value.trim().toLowerCase();
  const skills = buildSkillCatalog().filter(s => !query || `${s.name} ${s.rarity} ${s.description}`.toLowerCase().includes(query)).slice(0,180);
  const grid = $("skill-grid");
  grid.innerHTML = "";
  skills.forEach(skill => {
    const owned = isSkillOwned(skill);
    const el = document.createElement("article");
    el.className = `skill-card ${skill.enchanted?"enchanted":""} ${owned?"owned":""}`;
    el.style.setProperty("--rarity",skill.color);
    el.innerHTML = `<div class="skill-rarity">${skill.rarity}${skill.enchanted?" // ✦ ENCHANTED":""}</div>${owned?'<span class="owned-tag">OWNED</span>':''}<h3>${skill.name}</h3><p>${skill.description}</p><div class="skill-price">${owned?"ALREADY OWNED":fmtDox(skill.cost)+" DOX"}</div>`;
    el.addEventListener("click", () => openSkillDetail(skill));
    grid.appendChild(el);
  });
}
function openSkillDetail(skill) {
  selectedSkill = skill;
  const wrap = document.createElement("div");
  wrap.className = "skill-detail";
  const owned = isSkillOwned(skill);
  const cost = BigInt(skill.cost);
  wrap.innerHTML = `<div class="skill-detail-card ${skill.enchanted?"enchanted":""}"><div class="skill-rarity" style="--rarity:${skill.color}">${skill.rarity}${skill.enchanted?" // ✦ ENCHANTED":""}</div><h2>${skill.name}</h2><p>${skill.description}</p><div class="detail-price">${owned?"OWNED":"COST: "+fmtDox(cost)+" DOX"}</div><div class="skill-detail-actions"><button class="menu-button primary" id="skill-buy" ${owned||account.dox<cost?"disabled":""}>${owned?"OWNED":account.dox<cost?"NOT ENOUGH DOX":"BUY SKILL"}</button><button class="menu-button" id="skill-close">CLOSE</button></div></div>`;
  document.body.appendChild(wrap);
  $("skill-close").onclick = () => wrap.remove();
  if (!owned && account.dox >= cost) {
    $("skill-buy").onclick = async () => {
      account.dox -= cost;
      account.ownedSkills.push(skill.id);
      await saveAccount();
      updateWallet();
      wrap.remove();
      renderSkills();
    };
  }
}

/* ------------------------- BATTLE ENGINE ------------------------- */
function getBossHook(name) { return currentBoss?.hooks?.[name]; }
function createBossState(boss) { return boss.hooks?.createState ? boss.hooks.createState() : {}; }

function resetBattle(boss) {
  if (currentBoss?.hooks?.cleanup && currentBossState) currentBoss.hooks.cleanup(ctxForBoss());
  currentBoss = boss;
  currentBossState = createBossState(boss);
  bossHP = boss.maxHP;
  bossShield = boss.shield || 0;
  playerHP = boss.playerMaxHP;
  bossAttackEnabled = false;
  battleFinished = false;
  busy = false;
  cooldowns = new Map();
  brokenAttackIds = new Set();
  lastPlayerDamage = 0;
  document.body.classList.remove("azael-domain");
  document.querySelector(".domain-timer")?.remove();
}
let currentBossState = {};

function attackFromBase(base, key) {
  return {type:"base", key, name:base[0], min:base[1], max:base[2], messages:base[3] || ["The attack lands."], source:base};
}
function attackFromSkill(skill) {
  return {type:"skill", key:`skill:${skill.id}`, name:skill.name, min:skill.special === "rainbow-sword" ? 200000 : Math.round(skill.power*.75), max:skill.special === "rainbow-sword" ? 200000 : Math.round(skill.power*1.2), messages:skill.special === "rainbow-sword" ? [`A rainbow slash tears across ${currentBoss.name}.`,`The WIN CAN MAKE SWORD flashes through the arena.`,`A prismatic blade cuts the boss for massive damage.`] : [`${skill.name} detonates across ${currentBoss.name}.`,`The ${skill.rarity.toLowerCase()} skill tears into the boss.`,`Your purchased skill lands with brutal force.`], source:skill, power:skill.power};
}
function attackFromCustom(attack) {
  return {type:"custom", key:`custom:${attack.id}`, name:attack.name, min:Math.round(attack.power*.75), max:Math.round(attack.power*1.2), messages:[`${attack.name} tears into ${currentBoss.name}.`,attack.description,"The custom attack lands with brutal force."], source:attack, power:attack.power};
}
function buildAttackButtons() {
  const grid = $("attack-grid");
  grid.classList.remove("finishing-state");
  if (!currentBossState.empress) grid.classList.remove("empress-state");
  grid.innerHTML = "";

  currentBoss.playerAttacks.forEach((base,index) => addAttackButton(attackFromBase(base,`base:${index}`)));

  const ownedSkills = account?.ownedSkills || [];
  const resolved = [...new Map(ownedSkills.map(findConfiguredSkill).filter(Boolean).map(skill=>[skill.id,skill])).values()];
  resolved.forEach(skill => addAttackButton(attackFromSkill(skill)));

  (account?.attacks || []).forEach(attack => addAttackButton(attackFromCustom(attack)));

  Object.entries(account?.potions || {}).forEach(([id,count]) => {
    const potion = POTIONS.find(x=>x.id===id);
    if (!potion || Number(count)<=0) return;
    const button = document.createElement("button");
    button.className = "attack-button potion-button";
    button.dataset.potionId = potion.id;
    button.textContent = `${potion.name} x${count}`;
    button.title = potion.description;
    button.onclick = () => usePotion(potion.id);
    grid.appendChild(button);
  });

  updateHP();
}
function addAttackButton(attack) {
  const button = document.createElement("button");
  button.className = `attack-button ${attack.type!=="base"?"owned-skill":""} ${attack.source?.enchanted?"enchanted-skill":""} ${attack.source?.special === "rainbow-sword" ? "rainbow-sword-button" : ""}`;
  if (currentBossState.introLocked) {
    button.classList.add("battle-locked");
    button.disabled = true;
    button.setAttribute("aria-label", `${attack.name} locked during Aethelgard's introduction`);
  }
  button.dataset.attackKey = attack.key;
  button.textContent = attack.name;
  button.title = attack.source?.description || attack.name;
  if (attack.source?.color) button.style.setProperty("--rarity",attack.source.color);
  if (brokenAttackIds.has(attack.key)) { button.disabled=true; button.classList.add("broken"); }
  button.onclick = () => usePlayerAttack(attack);
  document.getElementById("attack-grid").appendChild(button);
}
function getAttackKey(button) { return button.dataset.attackKey || button.dataset.skillId || button.dataset.customAttack || null; }
function markBroken(key) { if(key!=null) brokenAttackIds.add(String(key)); }
function updateCooldowns() {
  const now = Date.now();
  document.querySelectorAll("#attack-grid .attack-button[data-attack-key]").forEach(button => {
    const key = button.dataset.attackKey;
    const until = cooldowns.get(key);
    if (until && until > now) {
      button.disabled=true;
      button.classList.add("skill-cooldown");
      button.dataset.cooldown=`${Math.ceil((until-now)/1000)}s`;
    } else if (!brokenAttackIds.has(key)) {
      button.disabled=false;
      button.classList.remove("skill-cooldown");
      delete button.dataset.cooldown;
    }
  });
}
function cooldownAttack(attack, ms) {
  if (!attack?.key) return;
  cooldowns.set(attack.key,Date.now()+ms);
  updateCooldowns();
}
function isCooling(attack) { return attack?.key && (cooldowns.get(attack.key)||0)>Date.now(); }
function getAttackKeyForObject(attack) { return attack?.key || null; }
function updateHP() {
  if (!currentBoss) return;
  const empress = Boolean(currentBossState.empress);
  const maxHP = empress ? currentBoss.empress.maxHP : currentBoss.maxHP;
  const hp = empress ? currentBossState.empressHP : bossHP;
  $("boss-hp-text").textContent = `${fmt(hp)} / ${fmt(maxHP)}`;
  $("boss-hp-fill").style.width = `${Math.max(0,hp/maxHP*100)}%`;
  $("boss-shield-fill").style.width = currentBoss.shield ? `${Math.max(0,bossShield/currentBoss.shield*100)}%` : "0%";
  $("boss-hp-percent").textContent = `${Math.ceil(Math.max(0,hp/maxHP*100))}%`;
  $("player-hp-text").textContent = fmt(playerHP);
  $("player-hp-fill").style.width = `${Math.max(0,playerHP/currentBoss.playerMaxHP*100)}%`;
  $("player-status-text").textContent = playerHP<currentBoss.playerMaxHP*.25 ? "SOUL CRITICAL" : "STILL STANDING";
  updateWallet();
  const remaining = [...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button):not(.broken):not(:disabled)")].length;
  $("player-attacks-remain").textContent = String(remaining).padStart(2,"0");
  $("attack-count").textContent = `${String(remaining).padStart(2,"0")} AVAILABLE`;
}
function applyBossDamage(damage) {
  let amount = Math.max(0,Number(damage)||0);
  if (bossShield>0) { const absorbed=Math.min(bossShield,amount); bossShield-=absorbed; amount-=absorbed; }
  bossHP=Math.max(0,bossHP-amount);
}
function damagePlayer(amount) { playerHP=Math.max(0,playerHP-Math.max(0,Number(amount)||0)); }
function attackToRange(attack) {
  if (attack.type === "base") return {min:attack.min,max:attack.max};
  return {min:Math.round(attack.power*.75),max:Math.round(attack.power*1.2)};
}

function ctxForBoss() {
  return {
    boss:currentBoss,
    state:currentBossState,
    get bossHP(){return bossHP;},
    set bossHP(v){bossHP=v;},
    get playerHP(){return playerHP;},
    set playerHP(v){playerHP=v;},
    get busy(){return busy;},
    set busy(v){busy=v;},
    bossAttackEnabled:value=>{bossAttackEnabled=value;},
    setBusy:value=>{busy=value;},
    isBusy:()=>busy,
    wait,
    pick,
    randomInt,
    fmt,
    fmtDox,
    setMessage,
    setPhase:setPhaseLabel,
    setStatus:text=>$("boss-status-text").textContent=text,
    setBossName:text=>$("boss-name").textContent=text,
    setBossLevel:text=>$("boss-level").textContent=text,
    setBossKicker:text=>$("boss-kicker").textContent=text,
    setBossAura:className=>$("boss-aura").className=`boss-aura ${className||""}`,
    setBossNameClass:className=>$("boss-name").classList.add(className),
    clearBossNameClass:()=>$("boss-name").className="",
    setCharacter:path=>setCharacter("battle-boss",path),
    setBackground,
    showFlash,
    shake,
    addMessageClass:name=>$("battle-message").classList.add(name),
    removeMessageClass:name=>$("battle-message").classList.remove(name),
    updateHP,
    buildAttackButtons,
    getAttackKey,
    markBroken,
    damagePlayer,
    applyBossDamage,
    playAudio,
    playParryEffect,
    cooldownAttack,
    isCooling,
    attackToRange,
    completeVictory,
    lose:showGameOver,
    getAttackKeyForObject,
    getPlayerAttackButtons:()=>[...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button):not(:disabled)")],
    get lastPlayerDamage(){ return lastPlayerDamage; }
  };
}

async function startBattle(boss) {
  busy=true;
  resetBattle(boss);
  encounterNumber++;
  $("encounter-count").textContent=String(encounterNumber).padStart(2,"0");
  showScreen("battle-screen");
  setBackground(boss.battleBackground || CONFIG.background);
  setPhaseLabel(`PHASE ONE // ${boss.name}`);
  setCharacter("battle-boss",boss.fight);
  $("boss-name").textContent=boss.name;
  $("boss-level").textContent=`${boss.stars} ★`;
  $("boss-kicker").textContent=boss.title;
  $("battle-title").textContent=boss.battleTitle || "THE KING HAS AWAKENED";
  $("boss-name").className="";
  $("boss-aura").className="boss-aura";
  $("boss-status-text").textContent="DORMANT POWER AWAKENED";
  $("boss-hp-label").textContent=boss.shield ? "SHIELD // VITALITY" : "ANCIENT SOUL SIGNATURE";
  buildAttackButtons();
  updateHP();
  setMessage(boss.intro.join(" "));
  if (settings.music) {
    const music=$("boss-music");
    music.src=boss.music;
    music.loop=true;
    music.volume=.6;
    music.play().catch(()=>{});
  }
  if (boss.hooks?.onStart) await boss.hooks.onStart(ctxForBoss());
  await wait(1500);
  if (boss.id === "argus") setMessage(boss.intro[0]);
  else if (boss.id === "azael") setMessage("Azael watches you. Something feels wrong.");
  else setMessage(`${boss.name} watches you. Choose your attack.`);
  bossAttackEnabled=true;
  busy=false;
}

async function maybeBreakSpecialAttack(attack) {
  if (attack.source?.special !== "rainbow-sword") return false;
  if (Math.random() >= (attack.source.breakChance || 0.04)) return false;
  account.ownedSkills = (account.ownedSkills || []).filter(v => String(v) !== String(attack.source.id) && String(v).trim().toLowerCase() !== String(attack.source.name).trim().toLowerCase());
  markBroken(attack.key);
  const brokenButton = [...document.querySelectorAll("#attack-grid [data-attack-key]")].find(el => el.dataset.attackKey === attack.key);
  if (brokenButton) {
    brokenButton.classList.add("rainbow-sword-broken");
    setTimeout(() => brokenButton.remove(), 700);
  }
  setMessage("THE WIN CAN MAKE SWORD SHATTERS. It has vanished from your account.");
  await saveAccount();
  return true;
}

async function usePlayerAttack(attack) {
  if (busy || playerHP<=0 || battleFinished || !bossAttackEnabled) return;
  if (brokenAttackIds.has(attack.key) || isCooling(attack)) return;
  busy=true;

  const ctx=ctxForBoss();

  if (attack.source?.special === "rainbow-sword") {
    const slash = document.createElement("div");
    slash.className = "rainbow-sword-slash";
    document.body.appendChild(slash);
    setTimeout(() => slash.remove(), 900);
    setMessage("WIN CAN MAKE SWORD unleashes a RAINBOW SLASH.");
  }

  if (currentBossState.empress && currentBoss.hooks?.playerAttackDuringEmpress) {
    await currentBoss.hooks.playerAttackDuringEmpress(ctx,attack);
    await maybeBreakSpecialAttack(attack);
    busy=false;
    return;
  }

  if (currentBoss.hooks?.beforePlayerAttack) {
    const blocked=await currentBoss.hooks.beforePlayerAttack(ctx,attack);
    if (blocked) { busy=false; return; }
  }

  let range=attackToRange(attack);
  let damage=randomInt(range.min,range.max);
  const wasStunned=Boolean(currentBossState.stunned);

  if (currentBoss.id === "aethelgard" && attack._aethelgardFixedDamage) damage = attack._aethelgardFixedDamage;
  if (currentBoss.id === "nebula" && attack._nebulaFixedDamage) damage = attack._nebulaFixedDamage;
  if (attack.source?.special === "rainbow-sword") damage = 200000;
  if (wasStunned) {
    currentBossState.stunned=false;
    damage=Math.round(damage*1.35);
    $("boss-status-text").textContent="AWAKENING // DOMAIN-BEARER";
    setMessage("AZAEL IS STILL STUNNED. Your opening hits with extra force.");
  } else {
    setMessage(`${pick(attack.messages)} ${currentBoss.name} takes ${fmt(damage)} damage.`);
  }

  lastPlayerDamage = damage;
  applyBossDamage(Math.min(bossHP+bossShield,damage));
  updateHP();
  shake();

  await maybeBreakSpecialAttack(attack);
  if (brokenAttackIds.has(attack.key)) await wait(700);

  if (bossHP<=0) {
    await handleBossDefeat();
    busy=false;
    return;
  }

  await wait(650);
  if (currentBoss.hooks?.afterPlayerHit) await currentBoss.hooks.afterPlayerHit(ctxForBoss());
  if (bossHP<=0) { await handleBossDefeat(); busy=false; return; }

  if (wasStunned) {
    setMessage("AZAEL WAS STUNNED. Your free turn is complete. Azael is waking up.");
    busy=false;
    return;
  }

  await bossTurn();
  busy=false;
}

async function bossTurn() {
  if (!bossAttackEnabled || playerHP<=0 || bossHP<=0) return;
  const hook=currentBoss.hooks?.bossTurn;
  if (hook) { await hook.call(currentBoss.hooks,ctxForBoss()); return; }
  const move=pick(currentBoss.bossAttacks || []);
  if (!move) return;
  const damage=randomInt(move[1],move[2]);
  damagePlayer(damage); updateHP(); setMessage(`${move[0]} hits you. You take ${fmt(damage)} damage.`); shake(); await wait(800); if(playerHP<=0)showGameOver();
}

async function handleBossDefeat() {
  bossAttackEnabled=false;
  const hook=currentBoss.hooks?.onDefeat;
  if (hook) {
    await hook.call(currentBoss.hooks,ctxForBoss());
    return;
  }
  await completeVictory(currentBoss.reward,currentBoss.name);
}

async function completeVictory(reward,bossName) {
  if (battleFinished) return;
  battleFinished=true;
  bossAttackEnabled=false;
  currentBoss.hooks?.cleanup?.(ctxForBoss());
  account.dox += toDox(reward);
  account.defeated[currentBoss.id]=(account.defeated[currentBoss.id]||0)+1;
  await saveAccount();
  updateWallet();
  $("boss-status-text").textContent="ENCOUNTER CLEARED";
  setPhaseLabel("VICTORIOUS // REWARD ACQUIRED");
  $("boss-music").pause();
  showFlash();
  await showVictorySequence(toDox(reward),bossName);
}

function showVictorySequence(reward,bossName) {
  return new Promise(async resolve => {
    const overlay=document.createElement("div");
    overlay.className="result-sequence victory-sequence";
    overlay.innerHTML=`<div class="result-runes"></div><div class="result-center"><div class="result-kicker">${bossName} // ENCOUNTER CLEARED</div><h1>VICTORIOUS!</h1><p>THE BOSS HAS FALLEN.</p></div><div class="money-reward"><span>DOX REWARD</span><strong>+0 DOX</strong></div>`;
    document.body.appendChild(overlay);
    const strong=overlay.querySelector("strong");
    const target=reward;
    let shown=0n;
    const steps=36;
    const increment=target/BigInt(steps)||1n;
    let i=0;
    const timer=setInterval(()=>{
      i++;
      shown=i>=steps?target:shown+increment;
      if(shown>target)shown=target;
      strong.textContent=`+${fmtDox(shown)} DOX`;
      if(i>=steps)clearInterval(timer);
    },42);
    await wait(3600);
    overlay.classList.add("result-out");
    await wait(600);
    overlay.remove();
    await transition(()=>{showScreen("lobby-screen");renderLobby();});
    resolve();
  });
}

function showGameOver() {
  if (battleFinished) return;
  bossAttackEnabled=false;
  currentBoss.hooks?.cleanup?.(ctxForBoss());
  $("boss-music").pause();
  const overlay=document.createElement("div");
  overlay.className="result-sequence defeat-sequence";
  overlay.innerHTML=`<div class="defeat-static"></div><div class="result-center"><div class="result-kicker">${currentBoss.name} // SIGNAL LOST</div><h1>DEFEATED.</h1><p>YOUR SOUL HAS BEEN CRUSHED.</p></div><div class="loss-reward"><span>DOX KEPT</span><strong>${fmtDox(account.dox)}</strong></div><div class="result-actions"><button id="result-retry" class="menu-button primary">RETURN TO THE FIGHT</button><button id="result-lobby" class="menu-button">RETURN TO LOBBY</button></div>`;
  document.body.appendChild(overlay);
  $("result-retry").onclick=async()=>{overlay.remove();await transition(()=>startBattle(currentBoss));};
  $("result-lobby").onclick=async()=>{overlay.remove();await transition(()=>{showScreen("lobby-screen");renderLobby();});};
}

function usePotion(id) {
  if (busy || playerHP<=0 || battleFinished) return;
  const potion=POTIONS.find(x=>x.id===id);
  if (!potion || Number(account?.potions?.[id]||0)<=0) return;
  if (playerHP>=currentBoss.playerMaxHP) { setMessage("Your soul is already at full health."); return; }
  busy=true;
  account.potions[id]--;
  const before=playerHP;
  playerHP=Math.min(currentBoss.playerMaxHP,playerHP+potion.heal);
  updateHP();
  buildAttackButtons();
  setMessage(`${potion.name} restores ${fmt(playerHP-before)} HP.`);
  showFlash();
  wait(650).then(()=>{
    if(playerHP>0&&!battleFinished){
      setMessage(`${potion.name} settles. The boss waits for your next battle skill.`);
    }
    busy=false;
  });
}

async function playParryEffect(src) {
  await playAudio(src,.9,true,false);
  const burst=document.createElement("div");
  burst.className="parry-burst";
  const target=$("battle-boss");
  if(target){const rect=target.getBoundingClientRect();burst.style.left=`${rect.left+rect.width/2}px`;burst.style.top=`${rect.top+rect.height*.43}px`;}
  document.body.appendChild(burst);
  setTimeout(()=>burst.remove(),900);
}

/* ------------------------- SETTINGS / NAV ------------------------- */
function loadSettings() {
  $("setting-effects").checked=settings.effects;
  $("setting-music").checked=settings.music;
  $("setting-motion").checked=settings.motion;
  document.body.classList.toggle("reduced-motion",settings.motion);
}
$("settings-save").addEventListener("click",()=>{
  settings.effects=$("setting-effects").checked;
  settings.music=$("setting-music").checked;
  settings.motion=$("setting-motion").checked;
  localStorage.setItem("yen_settings",JSON.stringify(settings));
  loadSettings();
});
loadSettings();

$("confirm-no").addEventListener("click",()=>$("confirm-screen").classList.add("hidden"));
$("confirm-yes").addEventListener("click",async()=>{
  const boss=pendingBoss;
  pendingBoss=null;
  $("confirm-screen").classList.add("hidden");
  if(boss) await transition(()=>startBattle(boss));
});
$("retry-yes")?.addEventListener("click",async()=>{ $("gameover-screen").classList.add("hidden"); if(currentBoss) await transition(()=>startBattle(currentBoss)); });
$("retry-no")?.addEventListener("click",async()=>{ $("gameover-screen").classList.add("hidden"); await transition(()=>{showScreen("lobby-screen");renderLobby();}); });
$("leave-battle").addEventListener("click",async()=>{
  bossAttackEnabled=false;
  currentBoss?.hooks?.cleanup?.(ctxForBoss());
  $("boss-music").pause();
  await transition(()=>{showScreen("lobby-screen");renderLobby();});
});
setInterval(updateCooldowns,250);

/* ------------------------- BOOT ------------------------- */
async function boot() {
  setBackground("assets/menu-background.jpg");
  showScreen("start-screen");
}
boot();
