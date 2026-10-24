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
  description:"A forbidden account-only execution. Leaves the target at exactly 1 HP."
}, async (ctx) => {
  const all=[...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button)")];
  all.forEach(b=>{b.classList.add("deathsringer-lock");b.disabled=true;});
  const title=document.createElement("div");
  title.className="deathsringer-title";
  [..."IT'S OVER"].forEach((ch,i)=>{
    const span=document.createElement("span");
    span.textContent=ch===" "?"\u00a0":ch;
    span.style.setProperty("--i",i);
    title.appendChild(span);
  });
  document.body.appendChild(title);
  await ctx.wait(1200);
  title.classList.add("deathsringer-fade");
  await ctx.wait(700);
  title.remove();

  const alert=document.createElement("div");
  alert.className="deathsringer-alert";
  alert.innerHTML='<div class="deathsringer-alert-symbol">⚠</div><div class="deathsringer-alert-text">ALERT</div>';
  document.body.appendChild(alert);
  const sound=new Audio("assets/Alert_sound.mp3");
  sound.volume=.98;
  sound.play().catch(()=>{});

  await ctx.wait(950);
  const target=document.querySelector("#battle-boss");
  const beam=document.createElement("div");
  beam.className="deathsringer-beam";
  if(target){
    const r=target.getBoundingClientRect();
    beam.style.setProperty("--target-x",`${r.left+r.width/2}px`);
    beam.style.setProperty("--target-y",`${r.top+r.height*.42}px`);
  }
  document.body.appendChild(beam);
  alert.classList.add("deathsringer-alert-impact");
  ctx.showFlash();
  ctx.shake();
  await ctx.wait(1150);
  beam.classList.add("deathsringer-beam-out");
  await ctx.wait(600);
  beam.remove();
  alert.remove();

  all.forEach((b,i)=>{
    b.classList.add("deathsringer-doomed");
    b.style.setProperty("--death-delay",`${i*35}ms`);
  });
  await ctx.wait(5000);
  all.forEach(b=>b.remove());
  return {damage:Math.max(0,ctx.bossHP-1),message:"D-E-A-T-H-S-R-I-N-G-E-R // IT'S OVER."};
});
