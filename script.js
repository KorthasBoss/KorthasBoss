/*
==========================================================
 KORTHAS WEBSITE — EASY CUSTOMIZATION
==========================================================
Put your own files in the /assets folder, then change only
the filenames below if you want different names.

IMAGE FILES:
  assets/korthas-idle.png
  assets/korthas-fight.png
  assets/korthas-defeat.png
  assets/korthas-stage2.png
  assets/korthas-attack.png

BACKGROUND:
  assets/background.gif  (change BACKGROUND_IMAGE below)

MUSIC:
  assets/korthas-theme.mp3

Change dialogue, HP, damage ranges and abilities in CONFIG.
==========================================================
*/

const BACKGROUND_IMAGE = "assets/Background.gif"; // <<< CHANGE YOUR BACKGROUND HERE

const CONFIG = {
  bossName: "KORTHAS",
  bossMaxHP: 700000,
  playerMaxHP: 180000,
  phaseTwoAtHP: 610000,
  empressMaxHP: 1000000,
  empressParryChance: 0.72,
  empressSkillCooldown: 19000,

  // <<< CHARACTER IMAGE FILES: replace these filenames if needed
  assets: {
    idle: "assets/idle.png",
    fight: "assets/Fight_Idle.png",
    defeat: "assets/Defeat.png",
    stageTwo: "assets/Stage_2.png",
    attack: "assets/Stage_2_Attack.png",
    empress: "assets/empress.png",
    music: "assets/Boss_Start_Music.mp3",
    parrySound: "assets/perry.mp3"
  },

  introLines: [
    "Hm...",
    "Oh it's you.",
    "Do you realize..",
    "You can wake up my Wife with you're stomping?!?",
    "....",
    "You want the Tome?. That's why you're here?"
  ],
  yesLines: [
    "....",
    "I see.",
    "You think you have what it takes.",
    "Have it you're way, dumb ass."
  ],
  phaseTwoLines: [
    "Heh..",
    "I guess this is it..",
    "You fucking.",
    "BASTARD!!!!!!"
  ],
  phaseTwoFinalLine: "WE'RE FIGHTING FOR REAAALLLL, THIS TIME!",
  defeatLines: [".....", "You... did it..."],
  empressLines: [
    "You dare to hurt my husband in my own castle.",
    "I didn't know magnet's can go this low.",
    "Yet",
    "Here you are.",
    "I WILL",
    "MAKE",
    "SURE",
    "YOU WIISH YOU NEVER DONE THIS"
  ],

  // Each move has its own randomized damage range and dialogue.
  playerAttacks: [
    { name: "VOID SLASH", min: 9000, max: 21000, messages: ["Your void slash tears through the dark.", "A clean hit. Korthas staggers.", "Blue sparks scatter from the impact."] },
    { name: "RUNE BURST", min: 7000, max: 26000, messages: ["Runes detonate around Korthas.", "The rune burst hits harder than expected.", "A ring of light snaps shut around the boss."] },
    { name: "SOUL PIERCE", min: 11000, max: 19000, messages: ["Your strike pierces his guard.", "The hit lands with a sharp crack.", "Korthas's aura flickers from the impact."] },
    { name: "ECHO BOLT", min: 6000, max: 28000, messages: ["An echo bolt ricochets into Korthas.", "The blast hits twice in quick succession.", "Blue energy bursts across the arena."] },
    { name: "TOME SHARD", min: 8000, max: 24000, messages: ["A shard of the Tome cuts through the air.", "The shard detonates on impact.", "Ancient lettering burns across his armor."] },
    { name: "STARFALL", min: 10000, max: 22000, messages: ["A star falls directly onto Korthas.", "The arena flashes as the star connects.", "The impact sends a ripple through the floor."] },
    { name: "DREAD WAVE", min: 5000, max: 30000, messages: ["A wave of dread crashes into the boss.", "The attack surges with unstable power.", "Korthas absorbs the hit with a growl."] },
    { name: "LAST WORD", min: 20000000, max: 20000000, messages: ["Your final word strikes like a curse.", "The attack lands with brutal precision.", "The air cracks around Korthas."] }
  ],
  bossAttacks: [
    { name: "TRIDENT ARC", min: 12000, max: 23000, messages: ["Korthas sweeps his trident across the arena!", "A blue arc slams into you!", "His trident cuts through the air with a roar!"] },
    { name: "TOME SHOCK", min: 8000, max: 28000, messages: ["Korthas releases a shockwave from the Tome!", "The floor flashes blue beneath your feet!", "A burst of ancient power catches you!"] },
    { name: "KING'S JUDGMENT", min: 15000, max: 32000, messages: ["Korthas brings down the King's Judgment!", "The hit rattles the whole arena!", "A crushing wave of energy strikes you!"] }
  ]
};

const $ = id => document.getElementById(id);
const introScreen = $("intro-screen");
const battleScreen = $("battle-screen");
const gameoverScreen = $("gameover-screen");
const staticScreen = $("static-screen");
const introLine = $("intro-line");
const choiceRow = $("choice-row");
const bossMusic = $("boss-music");

let bossHP = CONFIG.bossMaxHP;
let playerHP = CONFIG.playerMaxHP;
let phaseTwo = false;
let busy = false;
let brokenAttackIds = new Set();
let encounterNumber = 0;
let introRun = 0;
let empressPhase = false;
let empressHP = 0;
let empressSkillCooldowns = new Map();
let empressAttackEnabled = false;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const pick = list => list[Math.floor(Math.random() * list.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatHP = value => Math.max(0, Math.floor(value)).toLocaleString("en-US");

function setMessage(message) { $("battle-message").textContent = message; }
function setPhaseLabel(message) { $("phase-label").textContent = message; }

function setCharacterImage(elementId, path) {
  const img = $(elementId);
  img.src = path;
  img.onerror = () => {
    img.onerror = null;
    img.alt = `Missing image: ${path}. Add this file to the assets folder.`;
    img.style.opacity = "0.18";
    console.warn(`[Korthas] Image not found: ${path}. Add the file to your assets folder.`);
  };
}
function updateHP() {
  const maxHP = empressPhase ? CONFIG.empressMaxHP : CONFIG.bossMaxHP;
  const currentHP = empressPhase ? empressHP : bossHP;
  const name = empressPhase ? "EMPRESS" : CONFIG.bossName;
  $("boss-hp-text").textContent = `${formatHP(currentHP)} / ${formatHP(maxHP)}`;
  $("boss-hp-fill").style.width = `${Math.max(0, currentHP / maxHP * 100)}%`;
  $("boss-hp-percent").textContent = `${Math.ceil(Math.max(0, currentHP / maxHP * 100))}%`;
  $("boss-name").textContent = name;
  $("player-hp-text").textContent = formatHP(playerHP);
  $("player-hp-fill").style.width = `${Math.max(0, playerHP / CONFIG.playerMaxHP * 100)}%`;
  $("player-status-text").textContent = playerHP < CONFIG.playerMaxHP * .25 ? "SOUL CRITICAL" : "STILL STANDING";
  const available = getAvailableAttackIds().length;
  $("player-attacks-remain").textContent = String(available).padStart(2, "0");
  $("attack-count").textContent = `${String(available).padStart(2, "0")} AVAILABLE`;
}

function updateEmpressCooldowns() {
  const now = Date.now();
  for (const [id, expiresAt] of empressSkillCooldowns) {
    if (expiresAt <= now) empressSkillCooldowns.delete(id);
  }
  document.querySelectorAll("[data-attack-id]").forEach(button => {
    const id = Number(button.dataset.attackId);
    const expiresAt = empressSkillCooldowns.get(id);
    if (expiresAt) {
      const seconds = Math.ceil((expiresAt - now) / 1000);
      button.disabled = true;
      button.classList.add("skill-cooldown");
      button.dataset.cooldown = `${seconds}s`;
    } else {
      button.disabled = false;
      button.classList.remove("skill-cooldown");
      delete button.dataset.cooldown;
    }
  });
}

function showFlash() {
  const flash = document.createElement("div");
  flash.className = "flash-white";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1200);
}
function screenShake() {
  $("game").classList.remove("shake-screen");
  void $("game").offsetWidth;
  $("game").classList.add("shake-screen");
}
function applyBackground() {
  // Keep the original dark arena background visible even when the optional
  // background.gif is not bundled yet. If the image exists, it is layered
  // over the fallback without changing the rest of the site.
  const fallback = "radial-gradient(ellipse at 50% 0%, #17243d 0%, #090d17 45%, #05060b 100%)";
  document.body.style.backgroundImage = fallback;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";

  const image = new Image();
  image.onload = () => {
    document.body.style.backgroundImage = `linear-gradient(rgba(3,5,12,.70), rgba(3,4,9,.86)), url("${BACKGROUND_IMAGE}")`;
  };
  image.onerror = () => {
    // Leave the original arena gradient in place if the optional file is absent.
  };
  image.src = BACKGROUND_IMAGE;
}
function showIntro() {
  introRun++;
  const thisRun = introRun;
  bossHP = CONFIG.bossMaxHP;
  playerHP = CONFIG.playerMaxHP;
  phaseTwo = false;
  empressPhase = false;
  empressHP = 0;
  empressSkillCooldowns = new Map();
  empressAttackEnabled = false;
  busy = false;
  brokenAttackIds = new Set();
  introScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
  gameoverScreen.classList.add("hidden");
  staticScreen.classList.add("hidden");
  setCharacterImage("intro-boss", CONFIG.assets.idle);
  setCharacterImage("battle-boss", CONFIG.assets.fight);
  $("boss-aura").style.opacity = "";
  $("boss-name").classList.remove("angry-text");
  $("boss-status-text").textContent = "DORMANT POWER AWAKENED";
  $("intro-line").textContent = CONFIG.introLines[0];
  $("dialogue-count").textContent = `01 / ${String(CONFIG.introLines.length).padStart(2, "0")}`;
  choiceRow.classList.add("hidden");
  setPhaseLabel("ENCOUNTER WAITING");
  bossMusic.pause();
  bossMusic.currentTime = 0;
  runIntroText(thisRun);
}
async function runIntroText(runId) {
  for (let i = 0; i < CONFIG.introLines.length; i++) {
    if (runId !== introRun || introScreen.classList.contains("hidden")) return;
    introLine.textContent = CONFIG.introLines[i];
    $("dialogue-count").textContent = `${String(i + 1).padStart(2, "0")} / ${String(CONFIG.introLines.length).padStart(2, "0")}`;
    await wait(i === 0 ? 950 : 1150);
  }
  if (runId === introRun) choiceRow.classList.remove("hidden");
}
async function getOutEffect() {
  introScreen.classList.add("hidden");
  battleScreen.classList.add("hidden");
  gameoverScreen.classList.add("hidden");
  staticScreen.classList.remove("hidden");
  await wait(1900);
  // Most browsers only allow closing a tab if this page opened it.
  window.close();
}
async function startBattle() {
  if (busy) return;
  busy = true;
  introRun++;
  encounterNumber++;
  $("encounter-count").textContent = String(encounterNumber).padStart(2, "0");
  introScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  setPhaseLabel("PHASE ONE // THE TOME");
  bossHP = CONFIG.bossMaxHP;
  playerHP = CONFIG.playerMaxHP;
  phaseTwo = false;
  empressPhase = false;
  empressHP = 0;
  empressSkillCooldowns = new Map();
  empressAttackEnabled = false;
  brokenAttackIds = new Set();
  setCharacterImage("battle-boss", CONFIG.assets.fight);
  $("boss-name").textContent = CONFIG.bossName;
  $("boss-name").classList.remove("angry-text");
  $("boss-aura").style.opacity = "";
  $("boss-status-text").textContent = "DORMANT POWER AWAKENED";
  buildAttackButtons();
  updateHP();
  setMessage(CONFIG.yesLines.join(" "));
  bossMusic.src = CONFIG.assets.music;
  bossMusic.volume = 0.65;
  await wait(2200);
  try { await bossMusic.play(); } catch (e) { console.warn("[Korthas] Music playback blocked or file missing.", e); }
  setMessage("Korthas raises his trident. Choose your attack.");
  busy = false;
}
function buildAttackButtons() {
  const grid = $("attack-grid");
  // The Finish Him state is only for Korthas's defeat screen. Always clear it
  // before rebuilding the normal four-column attack layout for the next phase.
  grid.classList.remove("finishing-state");
  grid.classList.remove("empress-state");
  grid.innerHTML = "";
  CONFIG.playerAttacks.forEach((attack, id) => {
    const button = document.createElement("button");
    button.className = "attack-button";
    button.dataset.attackId = String(id);
    button.textContent = attack.name;
    button.addEventListener("click", () => usePlayerAttack(id));
    grid.appendChild(button);
  });
}
function getAvailableAttackIds() {
  return CONFIG.playerAttacks.map((_, id) => id).filter(id => !brokenAttackIds.has(id));
}
async function usePlayerAttack(id) {
  if (busy || brokenAttackIds.has(id) || playerHP <= 0) return;
  if (empressSkillCooldowns.has(id) && empressSkillCooldowns.get(id) > Date.now()) return;
  if (!empressPhase && bossHP <= 0) return;
  if (empressPhase && empressHP <= 0) return;

  busy = true;
  const attack = CONFIG.playerAttacks[id];

  if (empressPhase) {
    await useAttackAgainstEmpress(id, attack);
    busy = false;
    return;
  }

  const damage = Math.min(bossHP, randomInt(attack.min, attack.max));
  bossHP = Math.max(0, bossHP - damage);
  updateHP();
  setMessage(`${pick(attack.messages)} ${CONFIG.bossName} has taken ${formatHP(damage)} damage.`);
  const button = document.querySelector(`[data-attack-id="${id}"]`);
  if (button) button.animate([{transform:"scale(1)"},{transform:"scale(1.05)"},{transform:"scale(1)"}], {duration:280});

  // HP 0 is an absolute state check. Korthas cannot take another turn or
  // enter an intermediate phase once his HP has actually reached zero.
  if (bossHP <= 0) {
    await triggerKorthasDefeat();
    busy = false;
    return;
  }

  await wait(850);
  if (!phaseTwo && bossHP <= CONFIG.phaseTwoAtHP) {
    await triggerPhaseTwo();
    if (playerHP <= 0 || bossHP <= 0) { busy = false; return; }
  }
  await bossTurn();
  busy = false;
}

async function triggerKorthasDefeat() {
  empressPhase = false;
  empressAttackEnabled = false;
  brokenAttackIds = new Set(CONFIG.playerAttacks.map((_, id) => id));
  setCharacterImage("battle-boss", CONFIG.assets.defeat);
  $("boss-status-text").textContent = "DEFEATED // BARELY BREATHING";
  setPhaseLabel("KORTHAS DEFEATED // FINISH HIM");
  showFlash();
  screenShake();

  for (const line of CONFIG.defeatLines) {
    setMessage(line);
    $("battle-message").classList.add("defeat-text");
    await wait(line === "....." ? 900 : 1500);
  }
  $("battle-message").classList.remove("defeat-text");
  await showFinishHimButton();
}

async function showFinishHimButton() {
  const grid = $("attack-grid");
  const oldButtons = [...grid.querySelectorAll(".attack-button")];
  oldButtons.forEach(button => button.classList.add("defeat-fade"));
  await wait(620);
  grid.classList.add("finishing-state");
  grid.innerHTML = "";
  const button = document.createElement("button");
  button.className = "finish-him-button";
  button.innerHTML = '<span>FINISH HIM</span><small>THE FINAL BLOW</small>';
  button.addEventListener("click", finishKorthas);
  grid.appendChild(button);
  $("attack-count").textContent = "01 FINAL BLOW";
  await wait(80);
  button.classList.add("shaking-letters");
}

async function finishKorthas() {
  if (busy) return;
  busy = true;
  const button = document.querySelector(".finish-him-button");
  if (button) button.disabled = true;
  setMessage("FINISH HIM...");
  await wait(650);
  if (button) button.classList.add("knocked-away");
  await playParryEffect();
  setMessage("— PARRY —");
  $("battle-message").classList.add("parry-text");
  screenShake();
  showFlash();
  await wait(650);
  $("battle-message").classList.remove("parry-text");
  await summonEmpress();
  busy = false;
}

async function playParryEffect() {
  // Use a fresh audio node for every successful parry so a new parry can
  // always restart the sound instead of being swallowed by the previous one.
  const source = $("parry-sound");
  if (source) {
    const audio = source.cloneNode(true);
    audio.volume = 0.9;
    audio.currentTime = 0;
    audio.preload = "auto";
    audio.addEventListener("ended", () => audio.remove(), { once: true });
    document.body.appendChild(audio);
    try {
      await audio.play();
    } catch (e) {
      audio.remove();
      // Fallback metallic parry tone if the custom sound file is missing or
      // cannot be decoded. This keeps every parry audible.
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(780, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(170, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          setTimeout(() => ctx.close(), 250);
        }
      } catch (_) {}
    }
  }

  const shield = document.createElement("div");
  shield.className = "parry-burst";
  const target = $("battle-boss");
  if (target) {
    const rect = target.getBoundingClientRect();
    shield.style.left = `${rect.left + rect.width / 2}px`;
    shield.style.top = `${rect.top + rect.height * 0.43}px`;
  }
  document.body.appendChild(shield);
  setTimeout(() => shield.remove(), 900);
}

async function summonEmpress() {
  empressPhase = true;
  empressAttackEnabled = false;
  empressHP = CONFIG.empressMaxHP;
  empressSkillCooldowns = new Map();
  brokenAttackIds = new Set();
  $("boss-name").textContent = "EMPRESS";
  $("boss-status-text").textContent = "THE EMPRESS HAS ARRIVED";
  setPhaseLabel("PHASE THREE // THE EMPRESS");
  setCharacterImage("battle-boss", CONFIG.assets.empress);
  $("boss-aura").classList.add("empress-aura");
  $("boss-aura").style.opacity = "1";
  $("boss-aura").style.filter = "blur(11px)";
  $("boss-name").classList.add("empress-name");
  screenShake();
  updateHP();
  buildAttackButtons();
  $("attack-grid").classList.add("empress-state");
  setMessage(CONFIG.empressLines[0]);
  await wait(1200);
  for (let i = 1; i < CONFIG.empressLines.length; i++) {
    setMessage(CONFIG.empressLines[i]);
    if (i >= 4) {
      $("battle-message").classList.add("empress-rage");
      screenShake();
    }
    await wait(i >= 4 ? 520 : 1050);
  }
  $("battle-message").classList.remove("empress-rage");
  setMessage("Empress raises her sword. She is watching every move.");
  empressAttackEnabled = true;
  updateHP();
}

async function useAttackAgainstEmpress(id, attack) {
  if (!empressAttackEnabled) return;
  const button = document.querySelector(`[data-attack-id="${id}"]`);
  if (button) button.animate([{transform:"scale(1)"},{transform:"scale(1.05)"},{transform:"scale(1)"}], {duration:280});

  const parried = Math.random() < CONFIG.empressParryChance;
  if (parried) {
    await empressParry(id);
    return;
  }

  const damage = Math.min(empressHP, randomInt(attack.min, attack.max));
  empressHP -= damage;
  updateHP();
  setMessage(`${pick(attack.messages)} Empress takes ${formatHP(damage)} damage.`);
  await wait(850);

  if (empressHP <= 0) {
    empressAttackEnabled = false;
    setPhaseLabel("ENCOUNTER CLEARED // THE EMPRESS FALLS");
    $("boss-status-text").textContent = "EMPEROR'S CASTLE SILENCED";
    setCharacterImage("battle-boss", CONFIG.assets.empress);
    setMessage("The Empress falls... but the castle remembers your name.");
    showFlash();
    busy = false;
    return;
  }

  await empressTurn();
}

async function empressParry(id) {
  const button = document.querySelector(`[data-attack-id="${id}"]`);
  setMessage("EMPRESS PARRIES YOUR ATTACK.");
  $("battle-message").classList.add("parry-text");
  screenShake();
  await playParryEffect();
  if (button) {
    button.classList.add("parried-skill");
    button.disabled = true;
  }
  await wait(350);
  const slash = document.createElement("div");
  slash.className = "empress-slash";
  document.body.appendChild(slash);
  await wait(360);
  slash.remove();
  const damage = Math.min(playerHP, randomInt(18000, 34000));
  playerHP -= damage;
  const expiresAt = Date.now() + CONFIG.empressSkillCooldown;
  empressSkillCooldowns.set(id, expiresAt);
  updateHP();
  updateEmpressCooldowns();
  setMessage(`Empress cuts through your guard. ${CONFIG.playerAttacks[id].name} is sealed for 19 seconds.`);
  $("battle-message").classList.remove("parry-text");
  await wait(900);
  if (playerHP <= 0) {
    empressAttackEnabled = false;
    showGameOver();
    return;
  }
  updateEmpressCooldowns();
}

async function empressTurn() {
  if (!empressPhase || !empressAttackEnabled || playerHP <= 0 || empressHP <= 0) return;
  const damage = randomInt(9000, 21000);
  playerHP = Math.max(0, playerHP - damage);
  updateHP();
  setMessage(`Empress's blade flashes across the room. You take ${formatHP(damage)} damage.`);
  screenShake();
  await wait(800);
  updateEmpressCooldowns();
  if (playerHP <= 0) showGameOver();
}

async function triggerPhaseTwo() {
  phaseTwo = true;
  setPhaseLabel("PHASE TWO // NO MORE MERCY");
  $("boss-status-text").textContent = "LIMITERS DESTROYED";
  setCharacterImage("battle-boss", CONFIG.assets.defeat);
  for (const line of CONFIG.phaseTwoLines) {
    $("battle-message").textContent = line;
    $("battle-message").classList.add("angry-text");
    screenShake();
    await wait(line.includes("BASTARD") ? 1250 : 850);
  }
  $("battle-message").classList.remove("angry-text");
  showFlash();
  await wait(700);
  setCharacterImage("battle-boss", CONFIG.assets.stageTwo);
  $("boss-aura").style.opacity = "1";
  $("boss-aura").style.filter = "blur(9px)";
  $("boss-name").classList.add("angry-text");
  $("boss-status-text").textContent = "AWAKENED // DANGEROUS";
  setMessage(CONFIG.phaseTwoFinalLine);
  screenShake();
  await wait(1350);
  $("boss-name").classList.remove("angry-text");
  await breakThreeButtons();
}
async function breakThreeButtons() {
  const shuffled = getAvailableAttackIds().sort(() => Math.random() - .5);
  const toBreak = shuffled.slice(0, Math.min(3, shuffled.length));
  for (const id of toBreak) {
    const button = document.querySelector(`[data-attack-id="${id}"]`);
    if (!button) continue;
    $("battle-boss").classList.remove("boss-lunge");
    void $("battle-boss").offsetWidth;
    $("battle-boss").classList.add("boss-lunge");
    setMessage(`Korthas targets ${CONFIG.playerAttacks[id].name}...`);
    await wait(220);
    const spear = document.createElement("img");
    spear.src = CONFIG.assets.attack;
    spear.alt = "";
    spear.className = "spear-projectile";
    const rect = button.getBoundingClientRect();
    spear.style.setProperty("--target-x", `${rect.left + rect.width / 2}px`);
    spear.style.setProperty("--target-y", `${rect.top + rect.height / 2}px`);
    document.body.appendChild(spear);
    await wait(490);
    spear.remove();
    button.classList.add("broken");
    screenShake();
    await wait(600);
    button.remove();
    brokenAttackIds.add(id);
    updateHP();
    await wait(220);
  }
  $("battle-boss").classList.remove("boss-lunge");
  setMessage("Korthas has destroyed three of your attacks. He is faster now.");
}
async function bossTurn() {
  if (playerHP <= 0 || bossHP <= 0) return;
  const move = pick(CONFIG.bossAttacks);
  let damage = randomInt(move.min, move.max);
  if (phaseTwo) damage = Math.round(damage * 1.45);
  damage = Math.min(playerHP, damage);
  playerHP -= damage;
  updateHP();
  setMessage(`${pick(move.messages)} You take ${formatHP(damage)} damage.`);
  screenShake();
  await wait(900);
  if (playerHP <= 0) showGameOver();
}
setInterval(() => { if (empressPhase) updateEmpressCooldowns(); }, 250);

function showGameOver() {
  bossMusic.pause();
  battleScreen.classList.add("hidden");
  gameoverScreen.classList.remove("hidden");
  $("gameover-copy").textContent = empressPhase ? "The Empress has defeated you. Will you return to the castle?" : "Korthas has won. Will you face him again?";
}
document.querySelectorAll("[data-choice]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.choice === "no") getOutEffect();
    else startBattle();
  });
});
$("retry-yes").addEventListener("click", showIntro);
$("retry-no").addEventListener("click", getOutEffect);

// The background and image paths are deliberately easy to find.
applyBackground();
showIntro();
