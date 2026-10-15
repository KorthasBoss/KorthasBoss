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
 - When served by server.js, accounts are saved server-side and can be
   signed into from other devices.
 - If opened as a plain static file, a localStorage fallback is used.
==========================================================
*/

const CONFIG = {
  background: "assets/79909.gif",
  apiBase: "/api",
  accountStartingDox: 500000,
  bosses: {
    korthas: {
      id: "korthas", name: "KORTHAS", stars: 56, title: "THE OATHBOUND",
      maxHP: 700000, playerMaxHP: 180000, reward: 1500000,
      cardImage: "assets/korthas-idle.png", idle: "assets/korthas-idle.png", fight: "assets/korthas-fight.png",
      defeat: "assets/korthas-defeat.png", stageTwo: "assets/korthas-stage2.png", attack: "assets/korthas-attack.png",
      music: "assets/korthas-theme.mp3", battleBackground: "assets/Background.gif", parrySound: "assets/perry.mp3", shield: 0,
      phaseTwoAtHP: 610000,
      playerAttacks: [
        ["VOID SLASH",9000,21000,["Your void slash tears through the dark.","A clean hit. Korthas staggers.","Blue sparks scatter from the impact."]],
        ["RUNE BURST",7000,26000,["Runes detonate around Korthas.","The rune burst hits harder than expected.","A ring of light snaps shut around the boss."]],
        ["SOUL PIERCE",11000,19000,["Your strike pierces his guard.","The hit lands with a sharp crack.","Korthas's aura flickers from the impact."]],
        ["ECHO BOLT",6000,28000,["An echo bolt ricochets into Korthas.","The blast hits twice in quick succession.","Blue energy bursts across the arena."]],
        ["TOME SHARD",8000,24000,["A shard of the Tome cuts through the air.","The shard detonates on impact.","Ancient lettering burns across his armor."]],
        ["STARFALL",10000,22000,["A star falls directly onto Korthas.","The arena flashes as the star connects.","The impact sends a ripple through the floor."]],
        ["DREAD WAVE",5000,30000,["A wave of dread crashes into the boss.","The attack surges with unstable power.","Korthas absorbs the hit with a growl."]],
        ["LAST WORD",12000,20000,["Your final word strikes like a curse.","The attack lands with brutal precision.","The air cracks around Korthas."]]
      ],
      bossAttacks: [["TRIDENT ARC",12000,23000],["TOME SHOCK",8000,28000],["KING'S JUDGMENT",15000,32000]],
      intro: ["....","I see. You think you have what it takes.","Have it you're way, dumb ass."],
      phaseTwo: ["Heh..","I guess this is it..","You fucking.","BASTARD!!!!!!"],
      phaseFinal: "WE'RE FIGHTING FOR REAAALLLL, THIS TIME!",
      defeat: [".....","You... did it..."],
      empress: ["You dare to hurt my husband in my own castle.","I didn't know magnet's can go this low.","Yet","Here you are.","I WILL","MAKE","SURE","YOU WIISH YOU NEVER DONE THIS"]
    },
    argus: {
      id: "argus", name: "ARGUS", stars: 79, title: "THE LAST GUNNER",
      maxHP: 2000000, playerMaxHP: 180000, reward: 5000000,
      shield: 3000, cardImage: "assets/argus.png", idle: "assets/argus.png", fight: "assets/argus.png",
      music: "assets/korthas-theme.mp3", battleBackground: "assets/argus-battle-background.jpg", parrySound: "assets/argus-gun.mp3", reloadSound: "assets/argus-reload.mp3", gunImage: "assets/argus-gun.png",
      parryChance: .52,
      rapidBlastChance: .42, extraShotChance: .38, healChance: .20,
      playerAttacks: [
        ["VOID SLASH",9000,21000,["Your void slash tears through the dark.","The slash catches Argus clean.","A blue wound of light opens across his guard."]],
        ["RUNE BURST",7000,26000,["Runes detonate around Argus.","The burst rattles his shield.","Ancient symbols burn through the smoke."]],
        ["SOUL PIERCE",11000,19000,["You pierce the gunner's guard.","The hit lands with a brutal crack.","Argus's stance breaks for a second."]],
        ["ECHO BOLT",6000,28000,["An echo bolt snaps across the arena.","The bolt punches into Argus.","The shot is answered by a burst of blue light."]],
        ["TOME SHARD",8000,24000,["A Tome shard cuts through the air.","The shard detonates against his armor.","Ancient lettering flashes across his weapon."]],
        ["STARFALL",10000,22000,["A star crashes down on Argus.","The arena flashes white.","The impact sends a shock through his shield."]],
        ["DREAD WAVE",5000,30000,["A wave of dread rolls over the gunner.","Argus is forced backward.","The wave tears through his firing line."]],
        ["LAST WORD",12000,20000,["Your final word hits like a sentence.","The air cracks around Argus.","The gunner finally looks worried."]]
      ],
      bossAttacks: [["HAND CANNON",15000,27000],["BLACK ROUND",12000,24000],["EXECUTION SHOT",18000,30000]],
      intro: ["I have watched a thousand like you fall. You will be no different."],
      rapid: "That's all you got? Fuck it."
    }
  },
  merchant: {
    image: "assets/Merchant_Idle.png", background: "assets/Merchant_background.gif", music: "assets/merchant-theme.mp3",
    lines: [
      "Oh you're back.","Welcome back, hunter.","You look like somebody who needs a better skill.","I don't ask where you got that DOX.","You survived. That's enough for me.","The vault is open. Try not to go broke.","I've seen your type before.","You fight loud. I sell louder.","Pick something nasty.","Some skills bite back.","Enchanted ones cost what they cost.","Don't stare at the price. Earn more.","You want power? Pay for it.","I keep the good stuff behind the expensive stuff.","A cheap skill can still save your life.","A rare skill can ruin somebody else's.","The vault has four thousand answers.","You only need one.","Unless you're greedy.","Greedy is fine here.","That one? Interesting choice.","I wouldn't use it against Argus first.","Korthas hates flashy skills.","Argus hates everything.","The enchanted stock is temperamental.","Buy before the price feels worse.","You came back with more DOX.","Now you're speaking my language.","A hunter without skills is just target practice.","A hunter with too many skills is expensive target practice.","I've got something mean today.","I've got something beautiful today.","I've got something that should probably be illegal.","Relax. It's only a game.","Probably.","You want the vault? Hit the button.","Don't make me repeat myself.","The good stuff is glowing for a reason.","That purple glow means trouble.","The gold ones hurt wallets.","The red ones hurt bosses.","The blue ones save mistakes.","Buy wisely.","Or don't. I still get paid.","You look ready.","You're almost dangerous.","Almost.","Come back after another boss.","I'll have more bad ideas waiting.","Now go make me proud.","Welcome back, hunter."
    ]
  }
};

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random()*a.length)];
const randomInt = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const fmt = n => Math.max(0,Math.floor(n)).toLocaleString("en-US");
const tokenKey = "yen_session_token";
const localAccountKey = "yen_local_account";

let account = null;
let sessionToken = localStorage.getItem(tokenKey) || "";
let authMode = "register";
let currentBoss = null;
let bossHP = 0, bossShield = 0, playerHP = 0;
let phaseTwo = false, empressPhase = false, empressHP = 0;
let brokenAttackIds = new Set(), empressSkillCooldowns = new Map();
let encounterNumber = 0, busy = false, introRun = 0, battleFinished = false;
let bossAttackEnabled = false, pendingBoss = null;
let merchantIndex = 0, skillCatalog = null, selectedSkill = null;

const fallbackLocal = () => {
  try { return JSON.parse(localStorage.getItem(localAccountKey) || "null"); } catch { return null; }
};
const saveLocal = () => localStorage.setItem(localAccountKey, JSON.stringify(account));
async function api(path, options={}) {
  try {
    const headers = {"Content-Type":"application/json", ...(options.headers||{})};
    if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;
    const res = await fetch(`${CONFIG.apiBase}${path}`, {...options, headers});
    const data = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (e) {
    if (location.protocol === "file:") throw e;
    throw e;
  }
}
async function saveAccount() {
  if (!account) return;
  try {
    const data = await api("/save", {method:"POST", body:JSON.stringify({dox:account.dox, defeated:account.defeated, ownedSkills:account.ownedSkills})});
    account = data.account;
  } catch { saveLocal(); }
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
function setCharacter(id,path){const el=$(id);if(!el)return;el.src=path;el.onerror=()=>{el.onerror=null;el.style.opacity=".15";console.warn("Missing asset:",path)}}
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
  const username=$("auth-username").value.trim(), password=$("auth-password").value;
  $("auth-status").textContent="";
  try{
    const endpoint=authMode==="register"?"/register":"/login";
    const data=await api(endpoint,{method:"POST",body:JSON.stringify({username,password})});
    sessionToken=data.token;localStorage.setItem(tokenKey,sessionToken);account=data.account;saveLocal();
    await transition(()=>showScreen("lobby-screen"));renderLobby();
  }catch(e){
    // Static fallback keeps the site playable, but server mode is what enables other-device login.
    if(location.protocol==="file:" && authMode==="register"){
      if(fallbackLocal() && fallbackLocal().username.toLowerCase()===username.toLowerCase()) { $("auth-status").textContent="That local username already exists."; return; }
      account={username,dox:CONFIG.accountStartingDox,defeated:{},ownedSkills:[],createdAt:new Date().toISOString()};saveLocal();sessionToken="local";await transition(()=>showScreen("lobby-screen"));renderLobby();return;
    }
    if(location.protocol==="file:" && authMode==="login"){
      const a=fallbackLocal();if(a&&a.username.toLowerCase()===username.toLowerCase()&&password){account=a;sessionToken="local";await transition(()=>showScreen("lobby-screen"));renderLobby();return;}
    }
    $("auth-status").textContent=e.message;
  }
}
$("auth-form").addEventListener("submit",e=>{e.preventDefault();registerOrLogin()});
document.querySelectorAll("[data-auth-mode]").forEach(b=>b.addEventListener("click",()=>{authMode=b.dataset.authMode;document.querySelectorAll(".auth-tab").forEach(x=>x.classList.toggle("active",x===b));$("auth-submit").innerHTML=authMode==="register"?"CREATE ACCOUNT <span>↗</span>":"SIGN IN <span>↗</span>";$("auth-password").setAttribute("autocomplete",authMode==="register"?"new-password":"current-password")}));

document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",async()=>{const id=b.dataset.screen;if(id==="lobby-screen"&&!account){showScreen("auth-screen");return;}await transition(()=>showScreen(id));if(id==="merchant-screen")openMerchant();if(id==="lobby-screen")renderLobby();}));
$("brand-home").addEventListener("click",async e=>{e.preventDefault();if(account){await transition(()=>showScreen("lobby-screen"));renderLobby()}else showScreen("start-screen")});
$("logout-button").addEventListener("click",async()=>{try{await api("/logout",{method:"POST"})}catch{}sessionToken="";localStorage.removeItem(tokenKey);account=null;await transition(()=>showScreen("start-screen"));});

function bossCard(b){
  const el=document.createElement("article");el.className="boss-card";el.style.setProperty("--card-bg",`url("${b.cardImage}")`);el.innerHTML=`<div class="boss-card-bg"></div><div class="boss-card-badge">BOSS // ${String(b.stars).padStart(2,"0")} ★</div><img class="boss-card-art" src="${b.idle}" alt="${b.name} idle"><div class="boss-card-info"><div class="stars">${"★".repeat(Math.min(8,Math.ceil(b.stars/10)))} ${b.stars} STARS</div><h2>${b.name}</h2><p>${b.title} // REWARD ${fmt(b.reward)} DOX</p></div>`;el.addEventListener("click",()=>askBoss(b));return el;
}
function renderLobby(){$("boss-music").pause();setBackground("assets/lobby-background.jpg");updateWallet();const list=$("boss-list");list.innerHTML="";Object.values(CONFIG.bosses).forEach(b=>list.appendChild(bossCard(b)));const merchant=document.createElement("article");merchant.className="boss-card merchant-lobby-card";merchant.innerHTML=`<div class="boss-card-bg" style="background-image:url("${CONFIG.merchant.background}")"></div><div class="boss-card-badge">MERCHANT // SAFE</div><img class="boss-card-art" src="${CONFIG.merchant.image}" alt="Merchant"><div class="boss-card-info"><div class="stars">4,000 SKILLS IN STOCK</div><h2>MERCHANT</h2><p>NO THREAT // CUSTOM DIALOGUE // SKILL VAULT</p></div>`;merchant.addEventListener("click",async()=>{await transition(()=>showScreen("merchant-screen"));openMerchant()});list.appendChild(merchant);}
function askBoss(b){pendingBoss=b;$("confirm-title").textContent=`FIGHT ${b.name}?`;$("confirm-copy").textContent=`Are you sure you want to fight ${b.name}? It has ${b.stars} stars.`;$("confirm-screen").classList.remove("hidden");}
$("confirm-no").addEventListener("click",()=>$("confirm-screen").classList.add("hidden"));
$("confirm-yes").addEventListener("click",async()=>{const b=pendingBoss;pendingBoss=null;$("confirm-screen").classList.add("hidden");await transition(()=>startBattle(b));});

/* ------------------------- MERCHANT ------------------------- */
function buildSkillCatalog(){
  if(skillCatalog)return skillCatalog;
  const prefixes=["Void","Astral","Dread","Soul","Rune","Blood","Echo","Fallen","Solar","Night","Grave","Tome","Royal","Phantom","Seraph","Ruin","Star","Cursed","Abyssal","Thorn"];
  const cores=["Slash","Burst","Pierce","Nova","Judgment","Wave","Prism","Chain","Rift","Pulse","Meteor","Brand","Requiem","Tempest","Execution","Sigil","Crash","Sunder","Fang","Cannon"];
  const rarities=[
    {name:"COMMON",count:1700,color:"#7e94ae",mult:1,cost:[12000,70000]},
    {name:"RARE",count:1000,color:"#54cfff",mult:1.25,cost:[70000,250000]},
    {name:"EPIC",count:650,color:"#bd72ff",mult:1.7,cost:[250000,900000]},
    {name:"LEGENDARY",count:400,color:"#ffb84e",mult:2.4,cost:[900000,3500000]},
    {name:"MYTHIC",count:200,color:"#ff5573",mult:3.2,cost:[3500000,10000000]},
    {name:"ENCHANTED",count:50,color:"#f6b4ff",mult:4.5,cost:[10000000,25000000]}
  ];
  let id=0, out=[];
  rarities.forEach(r=>{for(let i=0;i<r.count;i++){const name=`${prefixes[(id*7)%prefixes.length]} ${cores[(id*11+i)%cores.length]} ${String(i+1).padStart(3,"0")}`;const power=Math.round(randomInt(9000,60000)*r.mult);const cost=randomInt(r.cost[0],r.cost[1]);out.push({id:String(id),name,rarity:r.name,color:r.color,enchanted:r.name==="ENCHANTED",cost,power,description:r.name==="ENCHANTED"?`A warped skill carrying an enchantment. Deals ${fmt(power)} damage and glows in battle.`:`A ${r.name.toLowerCase()} skill. Deals around ${fmt(power)} damage when it lands.`});id++;}});
  skillCatalog=out;return out;
}
function openMerchant(){merchantIndex=0;$("merchant-line").textContent=CONFIG.merchant.lines[0];$("merchant-dialog-count").textContent="01 / 50";$("merchant-subline").textContent="I've got something that'll make your next fight considerably less fair.";setCharacter("merchant-image",CONFIG.merchant.image);setBackground(CONFIG.merchant.background);if(settings.music){const music=$("boss-music");music.src=CONFIG.merchant.music;music.loop=true;music.volume=.4;music.play().catch(()=>{});}$("skill-shop").classList.add("hidden");}
$("merchant-next").addEventListener("click",()=>{merchantIndex=(merchantIndex+1)%CONFIG.merchant.lines.length;$("merchant-line").textContent=CONFIG.merchant.lines[merchantIndex];$("merchant-dialog-count").textContent=`${String(merchantIndex+1).padStart(2,"0")} / 50`;$("merchant-subline").textContent=merchantIndex===49?"That's all fifty. The vault is yours. Pick your weapon.":merchantIndex%3===0?"The vault is still open. Pick something brutal.":"I've got 4,000 ways to make a boss regret meeting you.";if(merchantIndex===49){buildSkillCatalog();$("skill-shop").classList.remove("hidden");renderSkills();}});
$("open-shop").addEventListener("click",()=>{buildSkillCatalog();$("skill-shop").classList.remove("hidden");renderSkills();});
function renderSkills(){const q=$("skill-search").value.trim().toLowerCase();const owned=new Set(account?.ownedSkills||[]);const skills=buildSkillCatalog().filter(s=>!q||`${s.name} ${s.rarity} ${s.description}`.toLowerCase().includes(q)).slice(0,180);const grid=$("skill-grid");grid.innerHTML="";skills.forEach(s=>{const el=document.createElement("article");el.className=`skill-card ${s.enchanted?"enchanted":""} ${owned.has(s.id)?"owned":""}`;el.style.setProperty("--rarity",s.color);el.innerHTML=`<div class="skill-rarity">${s.rarity}${s.enchanted?" // ✦ ENCHANTED":""}</div>${owned.has(s.id)?'<span class="owned-tag">OWNED</span>':''}<h3>${s.name}</h3><p>${s.description}</p><div class="skill-price">${owned.has(s.id)?"ALREADY OWNED":fmt(s.cost)+" DOX"}</div>`;el.addEventListener("click",()=>openSkillDetail(s));grid.appendChild(el);});}
$("skill-search").addEventListener("input",renderSkills);
function openSkillDetail(s){selectedSkill=s;const wrap=document.createElement("div");wrap.className="skill-detail";wrap.id="skill-detail";const owned=(account.ownedSkills||[]).includes(s.id);wrap.innerHTML=`<div class="skill-detail-card ${s.enchanted?"enchanted":""}"><div class="skill-rarity" style="--rarity:${s.color}">${s.rarity}${s.enchanted?" // ✦ ENCHANTED":""}</div><h2>${s.name}</h2><p>${s.description}</p><div class="detail-price">${owned?"OWNED":"COST: "+fmt(s.cost)+" DOX"}</div><div class="skill-detail-actions"><button class="menu-button primary" id="skill-buy" ${owned||account.dox<s.cost?"disabled":""}>${owned?"OWNED":account.dox<s.cost?"NOT ENOUGH DOX":"BUY SKILL"}</button><button class="menu-button" id="skill-close">CLOSE</button></div></div>`;document.body.appendChild(wrap);$("skill-close").onclick=()=>wrap.remove();if(!owned&&account.dox>=s.cost)$("skill-buy").onclick=async()=>{account.dox-=s.cost;account.ownedSkills=[...(account.ownedSkills||[]),s.id];await saveAccount();updateWallet();wrap.remove();renderSkills();};}

/* ------------------------- BATTLE ------------------------- */
function resetBattle(b){currentBoss=b;bossHP=b.maxHP;bossShield=b.shield||0;playerHP=b.playerMaxHP;phaseTwo=false;empressPhase=false;empressHP=0;brokenAttackIds=new Set();empressSkillCooldowns=new Map();bossAttackEnabled=false;battleFinished=false;}
function updateHP(){
  if(!currentBoss)return;const max=empressPhase?1000000:currentBoss.maxHP;const hp=empressPhase?empressHP:bossHP;
  $("boss-hp-text").textContent=`${fmt(hp)} / ${fmt(max)}`;$("boss-hp-fill").style.width=`${Math.max(0,hp/max*100)}%`;$("boss-shield-fill").style.width=currentBoss.shield?`${Math.max(0,bossShield/currentBoss.shield*100)}%`:"0%";$("boss-hp-percent").textContent=`${Math.ceil(Math.max(0,hp/max*100))}%`;
  $("player-hp-text").textContent=fmt(playerHP);$("player-hp-fill").style.width=`${Math.max(0,playerHP/currentBoss.playerMaxHP*100)}%`;$("player-status-text").textContent=playerHP<currentBoss.playerMaxHP*.25?"SOUL CRITICAL":"STILL STANDING";updateWallet();
  const available=getAvailableAttackIds().length;$("player-attacks-remain").textContent=String(available).padStart(2,"0");$("attack-count").textContent=`${String(available).padStart(2,"0")} AVAILABLE`;
}
function buildAttackButtons(){
  const grid=$("attack-grid");grid.classList.remove("finishing-state","empress-state");grid.innerHTML="";
  currentBoss.playerAttacks.forEach((a,id)=>{const b=document.createElement("button");b.className="attack-button";b.dataset.attackId=id;b.textContent=a[0];b.onclick=()=>usePlayerAttack(id,false);if(brokenAttackIds.has(id))b.disabled=true;grid.appendChild(b);});
  const owned=account?.ownedSkills||[];if(owned.length){buildSkillCatalog();owned.forEach(skillId=>{const s=skillCatalog.find(x=>x.id===skillId);if(!s)return;const b=document.createElement("button");b.className=`attack-button owned-skill ${s.enchanted?"enchanted-skill":""}`;b.dataset.skillId=s.id;b.textContent=s.name;b.style.setProperty("--rarity",s.color);b.title=s.description;b.onclick=()=>usePlayerAttack(s.id,true,s);grid.appendChild(b);});}
}
function getAvailableAttackIds(){return currentBoss.playerAttacks.map((_,i)=>i).filter(i=>!brokenAttackIds.has(i));}
function updateCooldowns(){const now=Date.now();document.querySelectorAll("[data-attack-id]").forEach(b=>{const id=Number(b.dataset.attackId),until=empressSkillCooldowns.get(id);if(until&&until>now){b.disabled=true;b.classList.add("skill-cooldown");b.dataset.cooldown=`${Math.ceil((until-now)/1000)}s`;}else{if(!brokenAttackIds.has(id))b.disabled=false;b.classList.remove("skill-cooldown");delete b.dataset.cooldown;}})}
async function startBattle(b){
  busy=true;resetBattle(b);encounterNumber++;$("encounter-count").textContent=String(encounterNumber).padStart(2,"0");showScreen("battle-screen");setBackground(b.battleBackground || (b.id==="korthas"?CONFIG.background:b.cardImage));setPhaseLabel(`PHASE ONE // ${b.name}`);setCharacter("battle-boss",b.fight);$("boss-name").textContent=b.name;$("boss-level").textContent=`${b.stars} ★`;$("boss-kicker").textContent=b.title;$("battle-title").textContent=b.id==="argus"?"THE LAST GUNNER":"THE KING HAS AWAKENED";$("boss-name").className="";$("boss-aura").className="boss-aura";$("boss-status-text").textContent="DORMANT POWER AWAKENED";$("boss-hp-label").textContent=b.shield?"SHIELD // VITALITY":"ANCIENT SOUL SIGNATURE";buildAttackButtons();updateHP();setMessage(b.intro.join(" "));if(settings.music){const music=$("boss-music");music.src=b.music;music.volume=.6;music.play().catch(()=>{});}await wait(1700);setMessage(b.id==="argus"?b.intro[0]:"Korthas raises his trident. Choose your attack.");bossAttackEnabled=true;busy=false;}

async function usePlayerAttack(id,isSkill=false,skill=null){
  if(busy||playerHP<=0||battleFinished)return;if(!isSkill&&brokenAttackIds.has(id))return;if(empressPhase&&empressSkillCooldowns.get(id)>Date.now())return;
  busy=true;
  if(empressPhase){await useAttackAgainstEmpress(id,isSkill?skill:currentBoss.playerAttacks[id]);busy=false;return;}
  if(currentBoss.id==="argus"){const blocked=await argusParryCheck(id,isSkill,skill);if(blocked){busy=false;return;}}
  let min,max,msgs,name;
  if(isSkill){min=Math.round(skill.power*.75);max=Math.round(skill.power*1.2);msgs=[`${skill.name} detonates across ${currentBoss.name}.`,`The ${skill.rarity.toLowerCase()} skill tears into the boss.`,`Your purchased skill lands with brutal force.`];name=skill.name;}
  else{const a=currentBoss.playerAttacks[id];[name,min,max,msgs]=a;}
  let damage=randomInt(min,max);damage=Math.min(bossHP+bossShield,damage);applyBossDamage(damage);updateHP();setMessage(`${pick(msgs)} ${currentBoss.name} takes ${fmt(damage)} damage.`);shake();
  if(bossHP<=0){await handleBossDefeat();busy=false;return;}
  await wait(700);
  if(currentBoss.id==="korthas"&&!phaseTwo&&bossHP<=currentBoss.phaseTwoAtHP){await triggerKorthasPhaseTwo();if(bossHP<=0){await handleBossDefeat();busy=false;return;}}
  await bossTurn();busy=false;
}
function applyBossDamage(d){if(bossShield>0){const absorbed=Math.min(bossShield,d);bossShield-=absorbed;d-=absorbed;}bossHP=Math.max(0,bossHP-d);}

async function triggerKorthasPhaseTwo(){phaseTwo=true;setPhaseLabel("PHASE TWO // NO MORE MERCY");$("boss-status-text").textContent="LIMITERS DESTROYED";setCharacter("battle-boss",currentBoss.defeat);for(const line of currentBoss.phaseTwo){setMessage(line);$("battle-message").classList.add("angry-text");shake();await wait(line.includes("BASTARD")?1100:750)}$("battle-message").classList.remove("angry-text");showFlash();await wait(500);setCharacter("battle-boss",currentBoss.stageTwo);$("boss-name").classList.add("angry-text");$("boss-status-text").textContent="AWAKENED // DANGEROUS";setMessage(currentBoss.phaseFinal);await wait(1000);$("boss-name").classList.remove("angry-text");await breakKorthasSkills();}
async function breakKorthasSkills(){const ids=getAvailableAttackIds().sort(()=>Math.random()-.5).slice(0,3);for(const id of ids){const b=document.querySelector(`[data-attack-id="${id}"]`);if(!b)continue;setMessage(`Korthas targets ${currentBoss.playerAttacks[id][0]}...`);await wait(200);b.classList.add("broken");shake();await wait(500);b.remove();brokenAttackIds.add(id);updateHP();}setMessage("Korthas has destroyed three of your attacks. He is faster now.");}
async function bossTurn(){if(!bossAttackEnabled||playerHP<=0||bossHP<=0)return;if(currentBoss.id==="argus"){await argusTurn();return;}const move=pick(currentBoss.bossAttacks);let d=randomInt(move[1],move[2]);if(phaseTwo)d=Math.round(d*1.45);playerHP=Math.max(0,playerHP-d);updateHP();setMessage(`${move[0]} hits you. You take ${fmt(d)} damage.`);shake();await wait(800);if(playerHP<=0)showGameOver();}

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
  if(Math.random()<currentBoss.rapidBlastChance){setMessage(currentBoss.rapid);$("battle-message").classList.add("argus-rage");shake();await wait(700);$("battle-message").classList.remove("argus-rage");let shots=3+(Math.random()<currentBoss.extraShotChance?1:0);for(let i=0;i<shots;i++){const x=document.createElement("div");x.className="rapid-flash";document.body.appendChild(x);setTimeout(()=>x.remove(),280);const d=Math.min(playerHP,19000);playerHP-=d;updateHP();setMessage(`RAPID BLAST // SHOT ${i+1} OF ${shots}. You take ${fmt(d)} damage.`);shake();await wait(420);if(playerHP<=0){showGameOver();return;}}await playAudio(currentBoss.reloadSound,.7);setMessage("Argus reloads.");return;}
  const d=Math.min(playerHP,randomInt(15000,27000));playerHP-=d;updateHP();setMessage(`Argus fires once. You take ${fmt(d)} damage.`);shake();await wait(700);if(playerHP<=0)showGameOver();}

async function completeBoss(isEmpress=false){if(battleFinished)return;battleFinished=true;bossAttackEnabled=false;$("boss-status-text").textContent="ENCOUNTER CLEARED";setPhaseLabel("ENCOUNTER CLEARED // REWARD ACQUIRED");const reward=isEmpress?currentBoss.reward+500000:currentBoss.reward;account.dox=(account.dox||0)+reward;account.defeated[currentBoss.id]=(account.defeated[currentBoss.id]||0)+1;await saveAccount();updateWallet();showReward(reward,currentBoss.name);setMessage(`${currentBoss.name} has fallen. You earned ${fmt(reward)} DOX.`);showFlash();await wait(1700);}
function showGameOver(){bossAttackEnabled=false;$("gameover-copy").textContent=`${currentBoss.name} has defeated you. Will you return to the hunt?`;$("gameover-screen").classList.remove("hidden");}
$("retry-yes").addEventListener("click",async()=>{$("gameover-screen").classList.add("hidden");if(currentBoss)await transition(()=>startBattle(currentBoss));});
$("retry-no").addEventListener("click",async()=>{$("gameover-screen").classList.add("hidden");await transition(()=>{showScreen("lobby-screen");renderLobby()});});
$("leave-battle").addEventListener("click",async()=>{bossAttackEnabled=false;$("boss-music").pause();await transition(()=>{showScreen("lobby-screen");renderLobby()});});
setInterval(updateCooldowns,250);

/* ------------------------- BOOT ------------------------- */
async function boot(){
  setBackground("assets/menu-background.jpg");
  // Restore server session when possible.
  if(sessionToken&&sessionToken!=="local"){
    try{const data=await api("/me");account=data.account;renderLobby();showScreen("lobby-screen");return;}catch{sessionToken="";localStorage.removeItem(tokenKey);}
  }
  if(sessionToken==="local"&&fallbackLocal()){account=fallbackLocal();renderLobby();showScreen("lobby-screen");return;}
  showScreen("start-screen");
}
boot();
