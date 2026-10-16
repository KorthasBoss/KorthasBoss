/*
==========================================================
 YEN! BOSS WORLD // MASTER CONFIG
==========================================================
CUSTOM FILES TO DROP INTO /assets:
 menu-idle.png, menu-background.jpg
 korthas-idle.png, korthas-fight.png, korthas-defeat.png,
 korthas-stage2.png, korthas-attack.png, korthas-lobby.jpg,
 korthas-theme.mp3
 empress.png, empress-parry.mp3
 argus-idle.png, argus-fight.png, argus-lobby.jpg,
 argus-theme.mp3, argus-parry.mp3, argus-reload.mp3, argus-gun.png
 merchant-idle.png, merchant-background.jpg, merchant-theme.mp3
 background.gif (optional arena fallback)

ACCOUNT MODE:
 - Accounts are defined in accounts.js and loaded directly by username/password.
 - Progress is session-only; edit accounts.js to change starting DOX/skills.
==========================================================
*/

const CONFIG = {
  background: "assets/79909.gif",
    accountStartingDox: 0,
  bosses: window.YEN_BOSSES,
  merchant: {
    image: "assets/Merchant_Idle.png", background: "assets/Merchant_background.gif", music: "assets/merchant-theme.mp3",
    lines: [
      "Oh you're back.","Welcome back, hunter.","You look like somebody who needs a better skill.","I don't ask where you got that DOX.","You survived. That's enough for me.","The vault is open. Try not to go broke.","I've seen your type before.","You fight loud. I sell louder.","Pick something nasty.","Some skills bite back.","Enchanted ones cost what they cost.","Don't stare at the price. Earn more.","You want power? Pay for it.","I keep the good stuff behind the expensive stuff.","A cheap skill can still save your life.","A rare skill can ruin somebody else's.","The vault has eight thousand answers.","You only need one.","Unless you're greedy.","Greedy is fine here.","That one? Interesting choice.","I wouldn't use it against Argus first.","Korthas hates flashy skills.","Argus hates everything.","The enchanted stock is temperamental.","Buy before the price feels worse.","You came back with more DOX.","Now you're speaking my language.","A hunter without skills is just target practice.","A hunter with too many skills is expensive target practice.","I've got something mean today.","I've got something beautiful today.","I've got something that should probably be illegal.","Relax. It's only a game.","Probably.","You want the vault? Hit the button.","Don't make me repeat myself.","The good stuff is glowing for a reason.","That purple glow means trouble.","The gold ones hurt wallets.","The red ones hurt bosses.","The blue ones save mistakes.","Buy wisely.","Or don't. I still get paid.","You look ready.","You're almost dangerous.","Almost.","Come back after another boss.","I'll have more bad ideas waiting.","Now go make me proud.","Welcome back, hunter."
    ]
  }
};

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random()*a.length)];
const randomInt = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const fmt = n => Math.max(0,Math.floor(n)).toLocaleString("en-US");
const localAccountKey = "yen_local_account";

let account = null;
let sessionToken = "script-accounts";
let authMode = "login";
let currentBoss = null;
let bossHP = 0, bossShield = 0, playerHP = 0;
let phaseTwo = false, empressPhase = false, empressHP = 0;
let brokenAttackIds = new Set(), empressSkillCooldowns = new Map();
let encounterNumber = 0, busy = false, introRun = 0, battleFinished = false;
let bossAttackEnabled = false, pendingBoss = null;
let azaelDomainActive = false, azaelDomainTimer = null, azaelStunned = false, azaelDomainEndsAt = 0;
let merchantIndex = 0, skillCatalog = null, selectedSkill = null;

const saveLocal = () => {}; // Script-defined accounts are the source of truth; progress is not persisted.
async function api(path, options={}) {
  throw new Error("This build uses accounts.js and does not connect to a server.");
}
function showSaveWarning(message) {
  let toast = document.getElementById("yen-save-warning");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yen-save-warning";
    toast.style.cssText = "position:fixed;z-index:99999;left:50%;bottom:22px;transform:translateX(-50%);max-width:min(92vw,560px);padding:12px 16px;border:1px solid #ff647c;background:#170b12;color:#fff;border-radius:10px;font:600 13px/1.45 system-ui;box-shadow:0 8px 34px #0009;text-align:center";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = "block";
}
async function saveAccount() {
  // DOX and purchased skills can change while playing, but are intentionally
  // not written anywhere. Change accounts.js to set the next login's values.
  return true;
}
async function transition(fn) {
  const el = document.createElement("div"); el.className="fade-transition"; document.body.appendChild(el);
  await wait(210); await fn(); await wait(120); el.remove();
}
function showScreen(id) {
  document.querySelectorAll(".portal-screen,.portal-subscreen,.battle-screen").forEach(x=>x.classList.add("hidden"));
  $(id)?.classList.remove("hidden");
  setPhaseLabel(id === "lobby-screen" ? "HUNTER LOBBY" : id === "merchant-screen" ? "MERCHANT // OPEN" : id === "start-screen" ? "WELCOME" : "YEN! // READY");
}
function showReward(amount, bossName) {
  const t=document.createElement("div");t.className="reward-toast";t.innerHTML=`<small>${bossName} DEFEATED // DOX ACQUIRED</small><strong>+${fmt(amount)} DOX</strong>`;document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}
function updateWallet(){ $("wallet-dox").textContent=fmt(account?.dox||0); $("battle-dox").textContent=fmt(account?.dox||0); }
function setMessage(m){$("battle-message").textContent=m;}
function setPhaseLabel(m){$("phase-label").textContent=m;}
function setCharacter(id,path){
  const el=$(id);
  if(!el)return;
  el.style.opacity="1";
  el.style.visibility="visible";
  el.onerror=()=>{
    el.onerror=null;
    el.style.opacity="1";
    el.style.visibility="visible";
    console.warn("Missing asset:",path);
  };
  el.src=path;
}
function showFlash(){if(!settings.effects)return;const x=document.createElement("div");x.className="flash-white";document.body.appendChild(x);setTimeout(()=>x.remove(),1100)}
function shake(){if(!settings.effects)return;$("game").classList.remove("shake-screen");void $("game").offsetWidth;$("game").classList.add("shake-screen")}
function setBackground(path, fallback){document.body.style.backgroundImage=fallback||"radial-gradient(ellipse at 50% 0%,#17243d,#090d17 45%,#05060b)";if(!path)return;const im=new Image();im.onload=()=>document.body.style.backgroundImage=`linear-gradient(#03050a99,#03040ae6),url("${path}")`;im.src=path;}

const settings = JSON.parse(localStorage.getItem("yen_settings")||'{"effects":true,"music":true,"motion":false}');
function playAudio(src, volume=.7, restart=true, waitForEnd=false){
  if(!settings.music||!src)return Promise.resolve();
  const a=new Audio(src); a.volume=volume; if(restart)a.currentTime=0; document.body.appendChild(a);
  return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;a.remove();resolve()};a.addEventListener("ended",finish,{once:true});a.addEventListener("error",finish,{once:true});a.play().catch(finish);if(!waitForEnd)setTimeout(finish,180);});
}
function loadSettings(){ $("setting-effects").checked=settings.effects;$("setting-music").checked=settings.music;$("setting-motion").checked=settings.motion;document.body.classList.toggle("reduced-motion",settings.motion); }
$("settings-save").addEventListener("click",()=>{settings.effects=$("setting-effects").checked;settings.music=$("setting-music").checked;settings.motion=$("setting-motion").checked;localStorage.setItem("yen_settings",JSON.stringify(settings));loadSettings();});
loadSettings();

async function registerOrLogin(){
  const username=$("auth-username").value.trim();
  const password=$("auth-password").value;
  $("auth-status").textContent="";
  const accounts=Array.isArray(window.YEN_ACCOUNTS)?window.YEN_ACCOUNTS:[];
  const found=accounts.find(a=>String(a.username||"").trim().toLowerCase()===username.toLowerCase()
    && String(a.password??"")===password);
  if(!found){
    $("auth-status").textContent=accounts.length
      ? "That username or password is incorrect."
      : "No accounts are configured yet. Add an account in accounts.js first.";
    return;
  }
  account={
    username:String(found.username),
    dox:Math.max(0,Math.floor(Number(found.dox)||0)),
    defeated:{},
    ownedSkills:Array.isArray(found.ownedSkills)?[...found.ownedSkills].map(String):[],
    attacks:Array.isArray(found.attacks)?found.attacks.map((a,i)=>({
      id:String(a.id||`custom-${i}`),
      name:String(a.name||`CUSTOM ATTACK ${i+1}`),
      power:Math.max(1,Math.floor(Number(a.power)||10000)),
      rarity:String(a.rarity||"CUSTOM"),
      color:String(a.color||"#ff5573"),
      description:String(a.description||"A custom account-only attack."),
      enchanted:false
    })):[],
    potions:found.potions&&typeof found.potions==="object"?{...found.potions}:{},
    createdAt:null
  };
  sessionToken="script-accounts";
  await transition(()=>showScreen("lobby-screen"));
  renderLobby();
}
$("auth-form").addEventListener("submit",e=>{e.preventDefault();registerOrLogin()});
document.querySelectorAll("[data-auth-mode]").forEach(b=>b.addEventListener("click",()=>{}));

document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",async()=>{const id=b.dataset.screen;if(id==="lobby-screen"&&!account){showScreen("auth-screen");return;}await transition(()=>showScreen(id));if(id==="merchant-screen")openMerchant();if(id==="lobby-screen")renderLobby();}));
$("brand-home").addEventListener("click",async e=>{e.preventDefault();if(account){await transition(()=>showScreen("lobby-screen"));renderLobby()}else showScreen("start-screen")});
$("logout-button").addEventListener("click",async()=>{sessionToken="script-accounts";account=null;await transition(()=>showScreen("start-screen"));});

function bossCard(b){
  const el=document.createElement("article");el.className="boss-card";el.style.setProperty("--card-bg",`url("${b.cardImage}")`);el.innerHTML=`<div class="boss-card-bg"></div><div class="boss-card-badge">BOSS // ${String(b.stars).padStart(2,"0")} ★</div><img class="boss-card-art" src="${b.idle}" alt="${b.name} idle"><div class="boss-card-info"><div class="stars">${"★".repeat(Math.min(8,Math.ceil(b.stars/10)))} ${b.stars} STARS</div><h2>${b.name}</h2><p>${b.title} // REWARD ${fmt(b.reward)} DOX</p></div>`;el.addEventListener("click",()=>askBoss(b));return el;
}
function renderLobby(){$("boss-music").pause();setBackground("assets/lobby-background.jpg");updateWallet();const list=$("boss-list");list.innerHTML="";Object.values(CONFIG.bosses).forEach(b=>list.appendChild(bossCard(b)));const merchant=document.createElement("article");merchant.className="boss-card merchant-lobby-card";merchant.innerHTML=`<div class="boss-card-bg" style="background-image:url("${CONFIG.merchant.background}")"></div><div class="boss-card-badge">MERCHANT // SAFE</div><img class="boss-card-art" src="${CONFIG.merchant.image}" alt="Merchant"><div class="boss-card-info"><div class="stars">8,000 SKILLS IN STOCK</div><h2>MERCHANT</h2><p>NO THREAT // CUSTOM DIALOGUE // SKILL VAULT</p></div>`;merchant.addEventListener("click",async()=>{await transition(()=>showScreen("merchant-screen"));openMerchant()});list.appendChild(merchant);}
function askBoss(b){pendingBoss=b;$("confirm-title").textContent=`FIGHT ${b.name}?`;$("confirm-copy").textContent=`Are you sure you want to fight ${b.name}? It has ${b.stars} stars.`;$("confirm-screen").classList.remove("hidden");}
$("confirm-no").addEventListener("click",()=>$("confirm-screen").classList.add("hidden"));
$("confirm-yes").addEventListener("click",async()=>{const b=pendingBoss;pendingBoss=null;$("confirm-screen").classList.add("hidden");await transition(()=>startBattle(b));});

/* ------------------------- MERCHANT ------------------------- */
function buildSkillCatalog(){
  if(skillCatalog)return skillCatalog;
  const prefixes=["Void","Astral","Dread","Soul","Rune","Blood","Echo","Fallen","Solar","Night","Grave","Tome","Royal","Phantom","Seraph","Ruin","Star","Cursed","Abyssal","Thorn"];
  const cores=["Slash","Burst","Pierce","Nova","Judgment","Wave","Prism","Chain","Rift","Pulse","Meteor","Brand","Requiem","Tempest","Execution","Sigil","Crash","Sunder","Fang","Cannon"];
  const rarities=[
    {name:"COMMON",count:1600,color:"#7e94ae",mult:1,cost:[12000,70000]},
    {name:"RARE",count:1000,color:"#54cfff",mult:1.25,cost:[70000,250000]},
    {name:"EPIC",count:700,color:"#bd72ff",mult:1.7,cost:[250000,900000]},
    {name:"LEGENDARY",count:500,color:"#ffb84e",mult:2.4,cost:[900000,3500000]},
    {name:"MYTHIC",count:200,color:"#ff5573",mult:3.2,cost:[3500000,10000000]},
    {name:"ENCHANTED",count:4000,color:"#f6b4ff",mult:8.5,cost:[25000000,500000000]}
  ];
  let id=0,out=[];
  rarities.forEach(r=>{
    for(let i=0;i<r.count;i++){
      const name=`${prefixes[(id*7)%prefixes.length]} ${cores[(id*11+i)%cores.length]} ${String(i+1).padStart(3,"0")}`;
      const power=Math.round(randomInt(r.name==="ENCHANTED"?90000:9000,r.name==="ENCHANTED"?220000:60000)*r.mult);
      const cost=randomInt(r.cost[0],r.cost[1]);
      out.push({
        id:String(id),name,rarity:r.name,color:r.color,enchanted:r.name==="ENCHANTED",
        cost,power,
        description:r.name==="ENCHANTED"
          ?`ENCHANTED ENDGAME SKILL. Deals around ${fmt(power)} damage. Extremely expensive and built to hurt bosses.`
          :`A ${r.name.toLowerCase()} skill. Deals around ${fmt(power)} damage when it lands.`
      });
      id++;
    }
  });
  skillCatalog=out;
  return out;
}

const POTIONS=[
  {id:"minor",name:"MINOR HEALING POTION",heal:25000,cost:25000,description:"Restores 25,000 HP."},
  {id:"greater",name:"GREATER HEALING POTION",heal:60000,cost:125000,description:"Restores 60,000 HP."},
  {id:"soul",name:"SOUL FLASK",heal:110000,cost:450000,description:"Restores 110,000 HP."},
  {id:"royal",name:"ROYAL ELIXIR",heal:150000,cost:1500000,description:"Restores 150,000 HP."},
  {id:"immortal",name:"IMMORTAL DRAUGHT",heal:999999,cost:12000000,description:"Restores your entire soul."}
];

function renderPotions(){
  const grid=$("potion-grid");
  if(!grid)return;
  grid.innerHTML="";
  account.potions=account.potions||{};
  POTIONS.forEach(p=>{
    const count=Number(account.potions[p.id]||0);
    const el=document.createElement("article");
    el.className="potion-card";
    el.innerHTML=`<span class="potion-owned">OWNED: ${count}</span><div class="skill-rarity">HEALING // CONSUMABLE</div><h3>${p.name}</h3><p>${p.description}</p><div class="potion-price">${fmt(p.cost)} DOX</div>`;
    el.onclick=()=>{
      if(account.dox<p.cost){showSaveWarning("NOT ENOUGH DOX FOR THIS POTION.");return;}
      account.dox-=p.cost;
      account.potions[p.id]=(account.potions[p.id]||0)+1;
      updateWallet();
      renderPotions();
    };
    grid.appendChild(el);
  });
}

function openMerchant(){merchantIndex=0;$("merchant-line").textContent=CONFIG.merchant.lines[0];$("merchant-dialog-count").textContent="01 / 50";$("merchant-subline").textContent="I've got something that'll make your next fight considerably less fair.";setCharacter("merchant-image",CONFIG.merchant.image);setBackground(CONFIG.merchant.background);if(settings.music){const music=$("boss-music");music.src=CONFIG.merchant.music;music.loop=true;music.volume=.4;music.play().catch(()=>{});}$("skill-shop").classList.add("hidden");}
$("merchant-next").addEventListener("click",()=>{merchantIndex=(merchantIndex+1)%CONFIG.merchant.lines.length;$("merchant-line").textContent=CONFIG.merchant.lines[merchantIndex];$("merchant-dialog-count").textContent=`${String(merchantIndex+1).padStart(2,"0")} / 50`;$("merchant-subline").textContent=merchantIndex===49?"That's all fifty. The vault is yours. Pick your weapon.":merchantIndex%3===0?"The vault is still open. Pick something brutal.":"I've got 8,000 ways to make a boss regret meeting you.";if(merchantIndex===49){buildSkillCatalog();$("skill-shop").classList.remove("hidden");renderSkills();}});
$("open-shop").addEventListener("click",()=>{buildSkillCatalog();$("skill-shop").classList.remove("hidden");renderSkills();});
function isSkillOwned(skill, owned=account?.ownedSkills||[]){return owned.some(value=>String(value)===String(skill.id)||String(value).trim().toLowerCase()===String(skill.name).trim().toLowerCase());}
function findConfiguredSkill(value){const key=String(value).trim();const catalog=buildSkillCatalog();return catalog.find(s=>String(s.id)===key)||catalog.find(s=>s.name.trim().toLowerCase()===key.toLowerCase())||null;}
function renderSkills(){renderPotions();const q=$("skill-search").value.trim().toLowerCase();const skills=buildSkillCatalog().filter(s=>!q||`${s.name} ${s.rarity} ${s.description}`.toLowerCase().includes(q)).slice(0,180);const grid=$("skill-grid");grid.innerHTML="";skills.forEach(s=>{const owned=isSkillOwned(s);const el=document.createElement("article");el.className=`skill-card ${s.enchanted?"enchanted":""} ${owned?"owned":""}`;el.style.setProperty("--rarity",s.color);el.innerHTML=`<div class="skill-rarity">${s.rarity}${s.enchanted?" // ✦ ENCHANTED":""}</div>${owned?'<span class="owned-tag">OWNED</span>':''}<h3>${s.name}</h3><p>${s.description}</p><div class="skill-price">${owned?"ALREADY OWNED":fmt(s.cost)+" DOX"}</div>`;el.addEventListener("click",()=>openSkillDetail(s));grid.appendChild(el);});}
$("skill-search").addEventListener("input",renderSkills);
function openSkillDetail(s){selectedSkill=s;const wrap=document.createElement("div");wrap.className="skill-detail";wrap.id="skill-detail";const owned=isSkillOwned(s);wrap.innerHTML=`<div class="skill-detail-card ${s.enchanted?"enchanted":""}"><div class="skill-rarity" style="--rarity:${s.color}">${s.rarity}${s.enchanted?" // ✦ ENCHANTED":""}</div><h2>${s.name}</h2><p>${s.description}</p><div class="detail-price">${owned?"OWNED":"COST: "+fmt(s.cost)+" DOX"}</div><div class="skill-detail-actions"><button class="menu-button primary" id="skill-buy" ${owned||account.dox<s.cost?"disabled":""}>${owned?"OWNED":account.dox<s.cost?"NOT ENOUGH DOX":"BUY SKILL"}</button><button class="menu-button" id="skill-close">CLOSE</button></div></div>`;document.body.appendChild(wrap);$("skill-close").onclick=()=>wrap.remove();if(!owned&&account.dox>=s.cost)$("skill-buy").onclick=async()=>{account.dox-=s.cost;account.ownedSkills=[...(account.ownedSkills||[]).filter(v=>!isSkillOwned(s,[v])),s.id];await saveAccount();updateWallet();wrap.remove();renderSkills();};}

/* ------------------------- BATTLE ------------------------- */
function resetBattle(b){
  if(azaelDomainTimer){clearInterval(azaelDomainTimer);azaelDomainTimer=null;}
  document.body.classList.remove("azael-domain");
  const oldTimer=document.querySelector(".domain-timer");if(oldTimer)oldTimer.remove();
  currentBoss=b;bossHP=b.maxHP;bossShield=b.shield||0;playerHP=b.playerMaxHP;
  phaseTwo=false;empressPhase=false;empressHP=0;brokenAttackIds=new Set();
  empressSkillCooldowns=new Map();bossAttackEnabled=false;battleFinished=false;
  azaelDomainActive=false;azaelStunned=false;azaelDomainEndsAt=0;
}
function updateHP(){
  if(!currentBoss)return;
  const max=empressPhase?1000000:currentBoss.maxHP;
  const hp=empressPhase?empressHP:bossHP;
  $("boss-hp-text").textContent=`${fmt(hp)} / ${fmt(max)}`;
  $("boss-hp-fill").style.width=`${Math.max(0,hp/max*100)}%`;
  $("boss-shield-fill").style.width=currentBoss.shield?`${Math.max(0,bossShield/currentBoss.shield*100)}%`:"0%";
  $("boss-hp-percent").textContent=`${Math.ceil(Math.max(0,hp/max*100))}%`;
  $("player-hp-text").textContent=fmt(playerHP);
  $("player-hp-fill").style.width=`${Math.max(0,playerHP/currentBoss.playerMaxHP*100)}%`;
  $("player-status-text").textContent=playerHP<currentBoss.playerMaxHP*.25?"SOUL CRITICAL":"STILL STANDING";
  updateWallet();
  const available=[...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button):not(.broken)")].length;
  $("player-attacks-remain").textContent=String(available).padStart(2,"0");
  $("attack-count").textContent=`${String(available).padStart(2,"0")} AVAILABLE`;
}

function buildAttackButtons(){
  const grid=$("attack-grid");
  grid.classList.remove("finishing-state","empress-state");
  grid.innerHTML="";
  currentBoss.playerAttacks.forEach((a,id)=>{
    const b=document.createElement("button");
    b.className="attack-button";
    b.dataset.attackId=id;
    b.textContent=a[0];
    b.onclick=()=>usePlayerAttack(id,false);
    if(brokenAttackIds.has(String(id)))b.disabled=true;
    grid.appendChild(b);
  });
  const owned=account?.ownedSkills||[];
  if(owned.length){
    buildSkillCatalog();
    const resolvedSkills=[...new Map(owned.map(value=>findConfiguredSkill(value)).filter(Boolean).map(s=>[s.id,s])).values()];
    resolvedSkills.forEach(skill=>{
      const b=document.createElement("button");
      b.className=`attack-button owned-skill ${skill.enchanted?"enchanted-skill":""}`;
      b.dataset.skillId=skill.id;
      b.textContent=skill.name;
      b.style.setProperty("--rarity",skill.color);
      b.title=skill.description;
      b.onclick=()=>usePlayerAttack(skill.id,true,skill);
      grid.appendChild(b);
    });
  }
  (account?.attacks||[]).forEach((attack,i)=>{
    const b=document.createElement("button");
    b.className="attack-button owned-skill custom-account-attack";
    b.dataset.customAttack=attack.id;
    b.textContent=attack.name;
    b.title=attack.description;
    b.style.setProperty("--rarity",attack.color);
    b.onclick=()=>usePlayerAttack(`custom-${i}`,true,attack);
    grid.appendChild(b);
  });
  Object.keys(account?.potions||{}).forEach(potionId=>{
    const p=POTIONS.find(x=>x.id===potionId);
    const count=Number(account.potions[potionId]||0);
    if(!p||count<=0)return;
    const b=document.createElement("button");
    b.className="attack-button potion-button";
    b.dataset.potionId=p.id;
    b.textContent=`${p.name} x${count}`;
    b.title=p.description;
    b.onclick=()=>usePotion(p.id);
    grid.appendChild(b);
  });
}
function getAvailableAttackIds(){
  return currentBoss.playerAttacks.map((_,i)=>i).filter(i=>!brokenAttackIds.has(String(i)));
}
function updateCooldowns(){
  const now=Date.now();
  document.querySelectorAll("[data-attack-id]").forEach(b=>{
    const id=Number(b.dataset.attackId),until=empressSkillCooldowns.get(id);
    if(until&&until>now){
      b.disabled=true;b.classList.add("skill-cooldown");b.dataset.cooldown=`${Math.ceil((until-now)/1000)}s`;
    }else{
      if(!brokenAttackIds.has(String(id)))b.disabled=false;
      b.classList.remove("skill-cooldown");delete b.dataset.cooldown;
    }
  });
}
function usePotion(id){
  if(busy||playerHP<=0||battleFinished)return;
  const p=POTIONS.find(x=>x.id===id);
  if(!p||Number(account?.potions?.[id]||0)<=0)return;
  if(playerHP>=currentBoss.playerMaxHP){setMessage("Your soul is already at full health.");return;}
  busy=true;
  account.potions[id]--;
  const before=playerHP;
  playerHP=Math.min(currentBoss.playerMaxHP,playerHP+p.heal);
  updateHP();buildAttackButtons();
  setMessage(`${p.name} restores ${fmt(playerHP-before)} HP.`);
  showFlash();
  wait(650).then(async()=>{if(playerHP>0&&!battleFinished)await bossTurn();busy=false;});
}

async function startBattle(b){
  busy=true;
  resetBattle(b);
  encounterNumber++;
  $("encounter-count").textContent=String(encounterNumber).padStart(2,"0");
  showScreen("battle-screen");
  setBackground(b.battleBackground || CONFIG.background);
  setPhaseLabel(`PHASE ONE // ${b.name}`);
  setCharacter("battle-boss",b.fight);
  $("boss-name").textContent=b.name;
  $("boss-level").textContent=`${b.stars} ★`;
  $("boss-kicker").textContent=b.title;
  $("battle-title").textContent=b.id==="argus"?"THE LAST GUNNER":b.id==="azael"?"THE DOMAIN HAS AWAKENED":"THE KING HAS AWAKENED";
  $("boss-name").className="";
  $("boss-aura").className="boss-aura";
  $("boss-status-text").textContent="DORMANT POWER AWAKENED";
  $("boss-hp-label").textContent=b.shield?"SHIELD // VITALITY":"ANCIENT SOUL SIGNATURE";
  buildAttackButtons();updateHP();
  setMessage(b.intro.join(" "));
  if(settings.music){
    const music=$("boss-music");music.src=b.music;music.volume=.6;music.play().catch(()=>{});
  }
  await wait(1700);
  setMessage(b.id==="argus"?b.intro[0]:b.id==="azael"?"Azael watches you. Something feels wrong.":"Korthas raises his trident. Choose your attack.");
  bossAttackEnabled=true;
  busy=false;
}

async function usePlayerAttack(id,isSkill=false,skill=null){
  if(busy||playerHP<=0||battleFinished)return;
  if(!isSkill&&brokenAttackIds.has(String(id)))return;
  if(empressPhase&&empressSkillCooldowns.get(id)>Date.now())return;
  busy=true;

  if(empressPhase){
    await useAttackAgainstEmpress(id,isSkill?skill:currentBoss.playerAttacks[id]);
    busy=false;return;
  }

  if(currentBoss.id==="argus"){
    const blocked=await argusParryCheck(id,isSkill,skill);
    if(blocked){busy=false;return;}
  }

  let min,max,msgs,name;
  if(isSkill){
    min=Math.round(skill.power*.75);
    max=Math.round(skill.power*1.2);
    msgs=[`${skill.name} detonates across ${currentBoss.name}.`,`The ${skill.rarity.toLowerCase()} skill tears into the boss.`,`Your purchased skill lands with brutal force.`];
    name=skill.name;
  }else{
    const a=currentBoss.playerAttacks[id];
    [name,min,max,msgs]=a;
  }

  let damage=randomInt(min,max);
  const wasAzaelStunned=currentBoss.id==="azael"&&azaelStunned;
  if(wasAzaelStunned){
    damage=Math.round(damage*1.35);
    azaelStunned=false;
    $("boss-status-text").textContent="AWAKENING // DOMAIN-BEARER";
    setMessage("AZAEL IS STILL STUNNED. Your opening hits with extra force.");
  }
  damage=Math.min(bossHP+bossShield,damage);
  applyBossDamage(damage);updateHP();
  if(!wasAzaelStunned)setMessage(`${pick(msgs)} ${currentBoss.name} takes ${fmt(damage)} damage.`);
  shake();

  if(bossHP<=0){await handleBossDefeat();busy=false;return;}
  await wait(700);

  if(currentBoss.id==="korthas"&&!phaseTwo&&bossHP<=currentBoss.phaseTwoAtHP){
    await triggerKorthasPhaseTwo();
    if(bossHP<=0){await handleBossDefeat();busy=false;return;}
  }

  // Azael is stunned for exactly one player turn.
  if(wasAzaelStunned){
    setMessage("AZAEL WAS STUNNED. Your free turn is complete.");
    busy=false;return;
  }

  await bossTurn();
  busy=false;
}

function applyBossDamage(d){
  if(bossShield>0){const absorbed=Math.min(bossShield,d);bossShield-=absorbed;d-=absorbed;}
  bossHP=Math.max(0,bossHP-d);
}

/* ------------------------- AZAEL DOMAIN + MINI GAME ------------------------- */
async function runAzaelMiniGame(){
  return new Promise(resolve=>{
    const wrap=document.createElement("div");
    wrap.className="domain-mini-game";
    wrap.innerHTML=`<div class="domain-mini-card">
      <div class="section-kicker">AZAEL // JUDGMENT GAME</div>
      <h2>BREAK THE JUDGMENT</h2>
      <p>Hit the button while the white marker is inside the red target. Fail and Azael tears through your soul.</p>
      <div class="domain-reaction"><div class="domain-reaction-target"></div><div class="domain-reaction-cursor"></div></div>
      <button class="domain-hit-button">STRIKE THE CORE</button>
    </div>`;
    document.body.appendChild(wrap);
    const cursor=wrap.querySelector(".domain-reaction-cursor");
    const button=wrap.querySelector(".domain-hit-button");
    const started=performance.now();
    let raf=0,done=false;
    const finish=success=>{
      if(done)return;done=true;cancelAnimationFrame(raf);wrap.remove();resolve(success);
    };
    const animate=now=>{
      const elapsed=now-started;
      const x=Math.min(100,(elapsed/1450)*100);
      cursor.style.left=`${x}%`;
      if(x>=100)finish(false);else raf=requestAnimationFrame(animate);
    };
    button.onclick=()=>{
      const x=parseFloat(cursor.style.left||"0");
      finish(x>=40&&x<=60);
    };
    raf=requestAnimationFrame(animate);
  });
}

async function activateAzaelDomain(){
  if(azaelDomainActive||currentBoss?.id!=="azael")return;
  azaelDomainActive=true;
  azaelDomainEndsAt=Date.now()+240000;
  setPhaseLabel("DOMAIN // FOUR MINUTES");
  setMessage(currentBoss.domainStart[0]);
  const black=document.createElement("div");
  black.className="domain-transition";
  document.body.appendChild(black);
  await wait(1100);
  document.body.classList.add("azael-domain");
  setBackground(currentBoss.domainBackground||currentBoss.battleBackground||CONFIG.background);
  $("boss-status-text").textContent="DOMAIN ACTIVE // UNPREDICTABLE";
  $("boss-aura").className="boss-aura empress-aura";
  const timer=document.createElement("div");
  timer.className="domain-timer";
  timer.textContent="DOMAIN // 04:00";
  document.body.appendChild(timer);
  const tick=()=>{
    const left=Math.max(0,azaelDomainEndsAt-Date.now());
    const sec=Math.ceil(left/1000);
    timer.textContent=`DOMAIN // ${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
    if(left<=0){
      clearInterval(azaelDomainTimer);azaelDomainTimer=null;
      azaelDomainActive=false;azaelDomainEndsAt=0;
      document.body.classList.remove("azael-domain");
      timer.remove();
      setBackground(currentBoss.battleBackground||CONFIG.background);
      setPhaseLabel(`PHASE ONE // ${currentBoss.name}`);
      $("boss-status-text").textContent="DOMAIN COLLAPSED // POWER RETURNED";
      setMessage(currentBoss.domainEnd);
    }
  };
  azaelDomainTimer=setInterval(tick,250);
  tick();
  await wait(1100);
  black.remove();
  setMessage("THE DOMAIN IS ACTIVE. AZAEL HAS UNLOCKED FIVE MORE SKILLS.");
}

async function azaelTurn(){
  if(!bossAttackEnabled||playerHP<=0||bossHP<=0)return;

  if(azaelDomainActive){
    const move=pick(currentBoss.domainAttacks);
    const d=Math.min(playerHP,randomInt(move.min,move.max));
    playerHP-=d;updateHP();
    setMessage(`${move.name} tears through the domain. You take ${fmt(d)} damage.`);
    showFlash();shake();await wait(750);
    if(playerHP<=0)showGameOver();
    return;
  }

  // DOMAIN has a 10% chance to fire. Once active, it stays for four minutes.
  if(Math.random()<currentBoss.domainAttack.chance){
    await activateAzaelDomain();
    return;
  }

  const move=Math.random()<.5?currentBoss.miniGameAttack:currentBoss.tearsAttack;
  if(move.type==="minigame"){
    setMessage("AZAEL forces you into a judgment game.");
    await wait(500);
    const success=await runAzaelMiniGame();
    if(success){
      azaelStunned=true;
      setMessage(currentBoss.miniGameAttack.successText);
      $("boss-status-text").textContent="STUNNED // ONE FREE TURN";
      showFlash();shake();await wait(850);
      return;
    }
    const d=Math.min(playerHP,randomInt(currentBoss.miniGameAttack.failDamage[0],currentBoss.miniGameAttack.failDamage[1]));
    playerHP-=d;updateHP();
    setMessage(`JUDGMENT FAILED. Azael crushes you for ${fmt(d)} damage.`);
    shake();await wait(850);
    if(playerHP<=0)showGameOver();
    return;
  }

  const d=Math.min(playerHP,randomInt(move.damage[0],move.damage[1]));
  playerHP-=d;updateHP();
  setMessage(`${pick(move.messages)} You take ${fmt(d)} damage.`);
  shake();await wait(850);
  if(playerHP<=0)showGameOver();
}

async function triggerKorthasPhaseTwo(){
  phaseTwo=true;
  setPhaseLabel("PHASE TWO // NO MORE MERCY");
  $("boss-status-text").textContent="LIMITERS DESTROYED";
  setCharacter("battle-boss",currentBoss.defeat);
  for(const line of currentBoss.phaseTwo){
    setMessage(line);$("battle-message").classList.add("angry-text");shake();
    await wait(line.includes("BASTARD")?1100:750);
  }
  $("battle-message").classList.remove("angry-text");
  showFlash();await wait(500);
  setCharacter("battle-boss",currentBoss.stageTwo);
  $("boss-name").classList.add("angry-text");
  $("boss-status-text").textContent="AWAKENED // DANGEROUS";
  setMessage(currentBoss.phaseFinal);await wait(1000);
  $("boss-name").classList.remove("angry-text");
  await breakKorthasSkills();
}

async function throwKorthasTrident(target){
  if(!target)return;
  const rect=target.getBoundingClientRect();
  const trident=document.createElement("img");
  trident.src=currentBoss.attack||"assets/korthas-attack.png";
  trident.className="spear-projectile";
  trident.style.setProperty("--target-x",`${rect.left+rect.width/2}px`);
  trident.style.setProperty("--target-y",`${rect.top+rect.height/2}px`);
  document.body.appendChild(trident);
  await wait(500);
  trident.remove();
}

async function breakKorthasSkills(){
  // Korthas's Trident Arc destroys ANY currently displayed player skill:
  // base attacks, purchased skills and custom account attacks.
  const buttons=[...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button)")].filter(b=>!b.disabled);
  const targets=buttons.sort(()=>Math.random()-.5).slice(0,Math.min(3,buttons.length));
  for(const b of targets){
    const key=b.dataset.attackId??b.dataset.skillId??b.dataset.customAttack;
    if(key==null)continue;
    setMessage(`Korthas targets ${b.textContent}...`);
    await throwKorthasTrident(b);
    b.classList.add("broken");shake();await wait(180);
    brokenAttackIds.add(String(key));
    b.remove();
    updateHP();
  }
  setMessage("Korthas's TRIDENT ARC has destroyed three of your skills. He is faster now.");
}

async function bossTurn(){
  if(!bossAttackEnabled||playerHP<=0||bossHP<=0)return;
  if(currentBoss.id==="argus"){await argusTurn();return;}
  if(currentBoss.id==="azael"){await azaelTurn();return;}
  const move=pick(currentBoss.bossAttacks);
  let d=randomInt(move[1],move[2]);
  if(phaseTwo)d=Math.round(d*1.45);
  playerHP=Math.max(0,playerHP-d);
  updateHP();setMessage(`${move[0]} hits you. You take ${fmt(d)} damage.`);
  shake();await wait(800);
  if(playerHP<=0)showGameOver();
}

/* KORTHAS DEFEAT -> FINISH HIM -> EMPRESS */
async function handleBossDefeat(){if(currentBoss.id!=="korthas"){await completeBoss();return;}bossAttackEnabled=false;battleFinished=false;brokenAttackIds=new Set(currentBoss.playerAttacks.map((_,i)=>i));setCharacter("battle-boss",currentBoss.defeat);setPhaseLabel("KORTHAS DEFEATED // FINISH HIM");$("boss-status-text").textContent="DEFEATED // BARELY BREATHING";showFlash();shake();for(const line of currentBoss.defeat){setMessage(line);$("battle-message").classList.add("defeat-text");await wait(line==="....."?850:1300)}$("battle-message").classList.remove("defeat-text");const grid=$("attack-grid");[...grid.children].forEach(x=>x.classList.add("defeat-fade"));await wait(620);grid.classList.add("finishing-state");grid.innerHTML="";const b=document.createElement("button");b.className="finish-him-button";b.innerHTML="<span>FINISH HIM</span><small>THE FINAL BLOW</small>";b.onclick=finishKorthas;grid.appendChild(b);$("attack-count").textContent="01 FINAL BLOW";setTimeout(()=>b.classList.add("shaking-letters"),80);}
async function finishKorthas(){if(busy)return;busy=true;const b=document.querySelector(".finish-him-button");if(b)b.disabled=true;setMessage("FINISH HIM...");await wait(500);if(b)b.classList.add("knocked-away");await playParryEffect(currentBoss.parrySound);setMessage("— PARRY —");$("battle-message").classList.add("parry-text");shake();showFlash();await wait(550);$("battle-message").classList.remove("parry-text");await summonEmpress();busy=false;}
async function playParryEffect(src){await playAudio(src,.9);const burst=document.createElement("div");burst.className="parry-burst";const target=$("battle-boss");if(target){const r=target.getBoundingClientRect();burst.style.left=`${r.left+r.width/2}px`;burst.style.top=`${r.top+r.height*.43}px`;}document.body.appendChild(burst);setTimeout(()=>burst.remove(),900);}
async function summonEmpress(){empressPhase=true;bossAttackEnabled=false;empressHP=1000000;empressSkillCooldowns=new Map();brokenAttackIds=new Set();$("boss-name").textContent="EMPRESS";$("boss-level").textContent="CASTLE // ???";$("boss-status-text").textContent="THE EMPRESS HAS ARRIVED";$("boss-kicker").textContent="THE QUEEN OF THE CASTLE";$("boss-aura").className="boss-aura empress-aura";$("boss-name").className="empress-name";setPhaseLabel("PHASE THREE // THE EMPRESS");setCharacter("battle-boss",currentBoss.id==="korthas"?"assets/empress.png":currentBoss.fight);buildAttackButtons();$("attack-grid").classList.add("empress-state");updateHP();setMessage(currentBoss.empress[0]);await wait(1100);for(let i=1;i<currentBoss.empress.length;i++){setMessage(currentBoss.empress[i]);if(i>=4){$("battle-message").classList.add("empress-rage");shake()}await wait(i>=4?500:950)}$("battle-message").classList.remove("empress-rage");setMessage("Empress raises her sword. She is watching every move.");bossAttackEnabled=true;}
async function useAttackAgainstEmpress(id,attack){const base=Array.isArray(attack)?attack:[attack.name,Math.round(attack.power*.75),Math.round(attack.power*1.2),[]];if(Math.random()<.72){await empressParry(id,base[0]);return;}const d=Math.min(empressHP,randomInt(base[1],base[2]));empressHP-=d;updateHP();setMessage(`${pick(base[3]||["Your skill lands."])} Empress takes ${fmt(d)} damage.`);await wait(750);if(empressHP<=0){await completeBoss(true);return;}await bossTurn();}
async function empressParry(id,name){setMessage("EMPRESS PARRIES YOUR ATTACK.");$("battle-message").classList.add("parry-text");shake();await playParryEffect("assets/empress-parry.mp3");const b=document.querySelector(`[data-attack-id="${id}"]`);if(b){b.classList.add("parried-skill");b.disabled=true;}await wait(260);const slash=document.createElement("div");slash.className="empress-slash";document.body.appendChild(slash);await wait(330);slash.remove();const d=randomInt(18000,34000);playerHP=Math.max(0,playerHP-d);if(typeof id==="number")empressSkillCooldowns.set(id,Date.now()+19000);updateHP();updateCooldowns();setMessage(`Empress cuts through your guard. ${name} is sealed for 19 seconds.`);$("battle-message").classList.remove("parry-text");await wait(750);if(playerHP<=0)showGameOver();}

/* ARGUS */
async function argusParryCheck(id,isSkill,skill){if(Math.random()>=currentBoss.parryChance)return false;const name=isSkill?skill.name:currentBoss.playerAttacks[id][0];setMessage(`ARGUS raises his weapon. ${name} is caught in the sightline.`);const line=document.createElement("div");line.className="gun-line";document.body.appendChild(line);await wait(150);line.remove();await playAudio(currentBoss.parrySound,.95,true,true);showFlash();shake();const b=document.querySelector(`[data-attack-id="${id}"]`);if(b){b.classList.add("parried-skill");b.disabled=true;b.classList.add("skill-cooldown");b.dataset.cooldown="20s";}if(typeof id==="number")empressSkillCooldowns.set(id,Date.now()+20000);playerHP=Math.max(0,playerHP-30000);updateHP();setMessage("ARGUS: Reloading.");await playAudio(currentBoss.reloadSound,.7);setMessage("He reloaded.");await wait(350);if(playerHP<=0)showGameOver();return true;}
async function argusTurn(){if(Math.random()<currentBoss.healChance){const heal=randomInt(100000,260000);bossHP=Math.min(currentBoss.maxHP,bossHP+heal);updateHP();setMessage(`ARGUS repairs himself. +${fmt(heal)} HP.`);showFlash();await wait(700);return;}
  if(Math.random()<currentBoss.rapidBlastChance){setMessage(currentBoss.rapid);$("battle-message").classList.add("argus-rage");shake();await wait(700);$("battle-message").classList.remove("argus-rage");let shots=3+(Math.random()<currentBoss.extraShotChance?1:0);for(let i=0;i<shots;i++){const x=document.createElement("div");x.className="rapid-flash";document.body.appendChild(x);setTimeout(()=>x.remove(),280);void playAudio("assets/argus-gun.mp3",.9,true,true);const d=Math.min(playerHP,19000);playerHP-=d;updateHP();setMessage(`RAPID BLAST // SHOT ${i+1} OF ${shots}. You take ${fmt(d)} damage.`);shake();await wait(420);if(playerHP<=0){showGameOver();return;}}await playAudio("assets/argus-reload.mp3",.7,true,true);setMessage("Argus reloads.");return;}
  const d=Math.min(playerHP,randomInt(15000,27000));playerHP-=d;updateHP();setMessage(`Argus fires once. You take ${fmt(d)} damage.`);shake();await wait(700);if(playerHP<=0)showGameOver();}

async function completeBoss(isEmpress=false){
  if(battleFinished)return;
  battleFinished=true;bossAttackEnabled=false;
  if(azaelDomainTimer){clearInterval(azaelDomainTimer);azaelDomainTimer=null;}
  document.body.classList.remove("azael-domain");
  const domainTimer=document.querySelector(".domain-timer");if(domainTimer)domainTimer.remove();
  azaelDomainActive=false;azaelDomainEndsAt=0;
$("boss-status-text").textContent="ENCOUNTER CLEARED";setPhaseLabel("ENCOUNTER CLEARED // REWARD ACQUIRED");const reward=isEmpress?currentBoss.reward+500000:currentBoss.reward;account.dox=(account.dox||0)+reward;account.defeated[currentBoss.id]=(account.defeated[currentBoss.id]||0)+1;await saveAccount();updateWallet();showReward(reward,currentBoss.name);setMessage(`${currentBoss.name} has fallen. You earned ${fmt(reward)} DOX.`);showFlash();await wait(1700);}
function showGameOver(){
  bossAttackEnabled=false;
  if(azaelDomainTimer){clearInterval(azaelDomainTimer);azaelDomainTimer=null;}
  document.body.classList.remove("azael-domain");
  const domainTimer=document.querySelector(".domain-timer");if(domainTimer)domainTimer.remove();
  azaelDomainActive=false;azaelDomainEndsAt=0;
  $("gameover-copy").textContent=`${currentBoss.name} has defeated you. Will you return to the hunt?`;$("gameover-screen").classList.remove("hidden");}
$("retry-yes").addEventListener("click",async()=>{$("gameover-screen").classList.add("hidden");if(currentBoss)await transition(()=>startBattle(currentBoss));});
$("retry-no").addEventListener("click",async()=>{$("gameover-screen").classList.add("hidden");await transition(()=>{showScreen("lobby-screen");renderLobby()});});
$("leave-battle").addEventListener("click",async()=>{bossAttackEnabled=false;if(azaelDomainTimer){clearInterval(azaelDomainTimer);azaelDomainTimer=null;}document.body.classList.remove("azael-domain");const domainTimer=document.querySelector(".domain-timer");if(domainTimer)domainTimer.remove();azaelDomainActive=false;$("boss-music").pause();await transition(()=>{showScreen("lobby-screen");renderLobby()});});
setInterval(updateCooldowns,250);

/* ------------------------- BOOT ------------------------- */
async function boot(){
  setBackground("assets/menu-background.jpg");
  showScreen("start-screen");
}
boot();
