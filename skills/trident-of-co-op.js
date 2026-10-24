/* YEN! // TRIDENT OF CO-OP */
window.YEN_REGISTER_SKILL({
  id:"trident-of-co-op",
  name:"TRIDENT OF CO-OP",
  rarity:"KISHIN // RELIC",
  color:"#55f5ff",
  enchanted:true,
  special:"trident-of-co-op",
  imageId:"trident-of-co-op-card",
  image:"assets/trident-of-co-op.png",
  cost:0,
  power:2500000,
  rewardOnly:true,
  killEffect:true,
  description:"SEA PREDATOR'S forbidden cooperative trident. Deals exactly 2,500,000 damage and tears open the arena with a colossal ocean VFX."
}, async (ctx, attack) => {
  const arena=document.createElement("div");
  arena.className="trident-coop-vfx";
  arena.innerHTML=`
    <div class="trident-coop-ocean"></div>
    <div class="trident-coop-ring ring-a"></div>
    <div class="trident-coop-ring ring-b"></div>
    <div class="trident-coop-lightning"></div>
    <div class="trident-coop-spear"><i></i><i></i><i></i></div>
    <div class="trident-coop-beam"></div>
    <div class="trident-coop-spray"></div>
    <div class="trident-coop-rainbow"></div>
    <div class="trident-coop-shockwave"></div>`;
  document.body.appendChild(arena);
  ctx.setMessage("TRIDENT OF CO-OP // THE ABYSS ANSWERS.");
  ctx.showFlash();
  ctx.shake();
  const target=document.querySelector("#battle-boss");
  if(target){
    const r=target.getBoundingClientRect();
    arena.style.left=`${r.left+r.width/2}px`;
    arena.style.top=`${r.top+r.height*.42}px`;
  }
  try {
    const audio=new Audio("assets/oceans.mp3");
    audio.volume=.65;
    audio.play().catch(()=>{});
  } catch {}
  await ctx.wait(850);
  arena.classList.add("trident-coop-impact");
  await ctx.wait(650);
  arena.remove();
  return {damage:2500000};
});
