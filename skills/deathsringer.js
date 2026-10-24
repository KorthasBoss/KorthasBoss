/* YEN! // SPECIAL SKILL // D-E-A-T-H-S-R-I-N-G-E-R */
window.YEN_REGISTER_SKILL({
  id:"deathsringer",
  name:"D-E-A-T-H-S-R-I-N-G-E-R",
  rarity:"SPECIAL // APOCALYPTIC",
  color:"#ffffff",
  enchanted:true,
  special:"deathsringer",
  imageId:"deathsringer-card",
  cost:0,
  power:1,
  description:"A forbidden account-only execution. Leaves the target at exactly 1 HP and unleashes the DeathsRinger sequence."
}, async (ctx) => {
  const oldButtons=[...document.querySelectorAll("#attack-grid .attack-button")];
  oldButtons.forEach(b=>{b.classList.add("deathsringer-lock");b.disabled=true;});
  const title=document.createElement("div");
  title.className="deathsringer-title";
  [..."IT'S OVER"].forEach((ch,i)=>{const span=document.createElement("span");span.textContent=ch===" "?"\u00a0":ch;span.style.setProperty("--i",i);title.appendChild(span);});
  document.body.appendChild(title);
  await ctx.wait(900);
  title.classList.add("deathsringer-fade");
  await ctx.wait(650);
  title.remove();
  const alert=document.createElement("div");
  alert.className="deathsringer-alert";
  alert.innerHTML='<div class="deathsringer-alert-symbol">⚠</div><div class="deathsringer-alert-text">ALERT</div>';
  document.body.appendChild(alert);
  const sound=new Audio("assets/Alert_sound.mp3"); sound.volume=.95; sound.play().catch(()=>{});
  await ctx.wait(900);
  const beam=document.createElement("div"); beam.className="deathsringer-beam"; document.body.appendChild(beam);
  ctx.shake();
  await ctx.wait(1250);
  beam.classList.add("deathsringer-beam-out");
  await ctx.wait(700); beam.remove();
  const skillButtons=[...document.querySelectorAll("#attack-grid .owned-skill")];
  skillButtons.forEach((b,i)=>{b.disabled=true;b.classList.add("deathsringer-doomed");b.style.setProperty("--death-delay",`${i*35}ms`);});
  await ctx.wait(5000);
  skillButtons.forEach(b=>b.remove());
  return {damage:Math.max(0,ctx.bossHP-1),message:"D-E-A-T-H-S-R-I-N-G-E-R // IT'S OVER."};
});
