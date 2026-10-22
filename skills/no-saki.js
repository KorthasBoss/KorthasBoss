/* YEN! // NO-SAKI */
window.YEN_REGISTER_SKILL({
  id:"no-saki",
  name:"NO-SAKI",
  rarity:"DELLA // FORBIDDEN REWARD",
  color:"#ffec8a",
  enchanted:true,
  rewardOnly:true,
  cost:0,
  power:30000000,
  vfxClass:"della-vfx-no-saki",
  killEffect:true,
  breakChance:0.18,
  description:"Della's forbidden weapon. Deals enormous damage and has an 18% chance to break one of the target's skills."
}, async (ctx, attack) => {
  const v=document.createElement("div");
  v.className="configured-skill-vfx della-vfx-no-saki skill-kill-vfx";
  document.body.appendChild(v);
  setTimeout(()=>v.remove(),1400);
  ctx.setMessage("NO-SAKI // DELLA'S FORBIDDEN BLADE HAS AWAKENED.");
  ctx.showFlash();
  ctx.shake();
  return {damage:30000000};
});
