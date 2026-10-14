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

  // <<< CHARACTER IMAGE FILES: replace these filenames if needed
  assets: {
    idle: "assets/idle.png",
    fight: "assets/Fight_Idle.png",
    defeat: "assets/Defeat.png",
    stageTwo: "assets/Stage_2.png",
    attack: "assets/Stage_2_Attack.png",
    music: "assets/Boss_Start_Music.mp3"
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

  // Each move has its own randomized damage range and dialogue.
  playerAttacks: [
    { name: "VOID SLASH", min: 9000, max: 21000, messages: ["Your void slash tears through the dark.", "A clean hit. Korthas staggers.", "Blue sparks scatter from the impact."] },
    { name: "RUNE BURST", min: 7000, max: 26000, messages: ["Runes detonate around Korthas.", "The rune burst hits harder than expected.", "A ring of light snaps shut around the boss."] },
    { name: "SOUL PIERCE", min: 11000, max: 19000, messages: ["Your strike pierces his guard.", "The hit lands with a sharp crack.", "Korthas's aura flickers from the impact."] },
    { name: "ECHO BOLT", min: 6000, max: 28000, messages: ["An echo bolt ricochets into Korthas.", "The blast hits twice in quick succession.", "Blue energy bursts across the arena."] },
    { name: "TOME SHARD", min: 8000, max: 24000, messages: ["A shard of the Tome cuts through the air.", "The shard detonates on impact.", "Ancient lettering burns across his armor."] },
    { name: "STARFALL", min: 10000, max: 22000, messages: ["A star falls directly onto Korthas.", "The arena flashes as the star connects.", "The impact sends a ripple through the floor."] },
    { name: "DREAD WAVE", min: 5000, max: 30000, messages: ["A wave of dread crashes into the boss.", "The attack surges with unstable power.", "Korthas absorbs the hit with a growl."] },
    { name: "LAST WORD", min: 12000, max: 20000, messages: ["Your final word strikes like a curse.", "The attack lands with brutal precision.", "The air cracks around Korthas."] }
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
  $("boss-hp-text").textContent = `${formatHP(bossHP)} / ${formatHP(CONFIG.bossMaxHP)}`;
  $("player-hp-text").textContent = formatHP(playerHP);
  $("boss-hp-fill").style.width = `${Math.max(0, bossHP / CONFIG.bossMaxHP * 100)}%`;
  $("player-hp-fill").style.width = `${Math.max(0, playerHP / CONFIG.playerMaxHP * 100)}%`;
  $("boss-hp-percent").textContent = `${Math.ceil(Math.max(0, bossHP / CONFIG.bossMaxHP * 100))}%`;
  $("player-status-text").textContent = playerHP < CONFIG.playerMaxHP * .25 ? "SOUL CRITICAL" : "STILL STANDING";
  $("player-attacks-remain").textContent = String(getAvailableAttackIds().length).padStart(2, "0");
  $("attack-count").textContent = `${String(getAvailableAttackIds().length).padStart(2, "0")} AVAILABLE`;
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
  document.body.style.backgroundImage = `linear-gradient(rgba(3,5,12,.70), rgba(3,4,9,.86)), url("${BACKGROUND_IMAGE}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}
function showIntro() {
  introRun++;
  const thisRun = introRun;
  bossHP = CONFIG.bossMaxHP;
  playerHP = CONFIG.playerMaxHP;
  phaseTwo = false;
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
  if (busy || brokenAttackIds.has(id) || playerHP <= 0 || bossHP <= 0) return;
  busy = true;
  const attack = CONFIG.playerAttacks[id];
  const damage = Math.min(bossHP, randomInt(attack.min, attack.max));
  bossHP -= damage;
  updateHP();
  setMessage(`${pick(attack.messages)} ${CONFIG.bossName} has taken ${formatHP(damage)} damage.`);
  const button = document.querySelector(`[data-attack-id="${id}"]`);
  if (button) button.animate([{transform:"scale(1)"},{transform:"scale(1.05)"},{transform:"scale(1)"}], {duration:280});
  await wait(850);
  if (!phaseTwo && bossHP <= CONFIG.phaseTwoAtHP) {
    await triggerPhaseTwo();
    if (playerHP <= 0 || bossHP <= 0) { busy = false; return; }
  }
  if (bossHP <= 0) {
    setMessage("Korthas falls silent. The Tome is yours... for now.");
    setCharacterImage("battle-boss", CONFIG.assets.defeat);
    setPhaseLabel("ENCOUNTER CLEARED");
    $("boss-status-text").textContent = "SIGNAL LOST";
    busy = false;
    return;
  }
  await bossTurn();
  busy = false;
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
function showGameOver() {
  bossMusic.pause();
  battleScreen.classList.add("hidden");
  gameoverScreen.classList.remove("hidden");
  $("gameover-copy").textContent = "Korthas has won. Will you face him again?";
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
