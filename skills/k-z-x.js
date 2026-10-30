/* YEN! // HELMET KISHIN // K,Z,X
   Dedicated script: this Kishin owns its own damage, healing, voice lines and VFX.
*/
window.YEN_REGISTER_SKILL({
  id:"k-z-x",
  name:"K,Z,X",
  rarity:"KISHIN // GLITCH ENTITY",
  color:"#ff38ff",
  enchanted:true,
  special:"helmet-kishin",
  imageId:"k-z-x-card",
  image:"assets/k-z-x.png",
  cost:"999999999999999999",
  power:1000000,
  description:"A corrupted rainbow-static Kishin. Every activation deals exactly 1,000,000 damage and has a 67% chance to heal its owner for 67% of maximum HP.",
  bio:"K,Z,X is a violent glitch entity hidden inside Helmet's private inventory. Its slash tears through the arena in rainbow static while its broken voice echoes through the fight.",
  shopEffect:"1,000,000 DAMAGE // 67% HEAL CHANCE",
  shopVisible:false
}, async (ctx) => {
  const voices = [
    "assets/k-z-x-voice-1.mp3",
    "assets/k-z-x-voice-2.mp3",
    "assets/k-z-x-voice-3.mp3"
  ];
  const variant = 1 + Math.floor(Math.random() * 3);
  const voice = voices[Math.floor(Math.random() * voices.length)];

  const arena = document.createElement("div");
  arena.className = `kzx-vfx kzx-variant-${variant}`;
  arena.innerHTML = `
    <div class="kzx-static"></div>
    <div class="kzx-glitch-frame"></div>
    <div class="kzx-target-ring"></div>
    <div class="kzx-slash kzx-slash-a"></div>
    <div class="kzx-slash kzx-slash-b"></div>
    <div class="kzx-slash kzx-slash-c"></div>
    <div class="kzx-rainbow-core"></div>
    <div class="kzx-pixel-burst"></div>
    <div class="kzx-scanline"></div>`;
  document.body.appendChild(arena);

  const target = document.querySelector("#battle-boss");
  if (target) {
    const r = target.getBoundingClientRect();
    arena.style.setProperty("--kzx-x", `${r.left + r.width / 2}px`);
    arena.style.setProperty("--kzx-y", `${r.top + r.height * .43}px`);
  }

  ctx.setMessage(`K,Z,X // GLITCH SLASH ${variant} // SIGNAL CORRUPTED.`);
  ctx.showFlash();
  ctx.shake();

  try {
    const audio = new Audio(voice);
    audio.volume = .9;
    audio.preload = "auto";
    audio.play().catch(() => {});
  } catch {}

  await ctx.wait(120);
  arena.classList.add("kzx-strike");

  // Give the slash a moment to visibly connect before applying its exact damage.
  await ctx.wait(520);

  const maxHP = Number(ctx.boss?.playerMaxHP || 180000);
  const healChance = Math.random() < .67;
  let healed = 0;

  if (healChance) {
    healed = Math.round(maxHP * .67);
    ctx.playerHP = Math.min(maxHP, Number(ctx.playerHP || 0) + healed);
    ctx.updateHP();

    const heal = document.createElement("div");
    heal.className = "kzx-heal-burst";
    heal.innerHTML = `<span>+${ctx.fmt(healed)} HP</span>`;
    document.body.appendChild(heal);
    setTimeout(() => heal.remove(), 1100);
    ctx.setMessage(`K,Z,X // 1,000,000 DAMAGE // GLITCH REGEN +${ctx.fmt(healed)} HP.`);
  } else {
    ctx.setMessage("K,Z,X // 1,000,000 DAMAGE // THE GLITCH REFUSED TO HEAL.");
  }

  await ctx.wait(500);
  arena.classList.add("kzx-fade");
  await ctx.wait(450);
  arena.remove();

  return {
    damage:1000000,
    message: healChance
      ? `K,Z,X tears through the target for 1,000,000 damage and restores ${ctx.fmt(healed)} HP.`
      : "K,Z,X tears through the target for exactly 1,000,000 damage."
  };
});
