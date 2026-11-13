/* YEN! // WIN CAN MAKE SWORD */
window.YEN_REGISTER_SKILL({
  id:"win-can-make-sword",
  name:"WIN CAN MAKE SWORD",
  rarity:"DIVINE // CUSTOM",
  color:"#ffffff",
  enchanted:true,
  shopVisible:true,
  special:"rainbow-sword",
  breakChance:0.04,
  cost:8000000,
  power:200000,
  killEffect:true,
  description:"A forbidden rainbow blade. Deals exactly 200,000 damage and has a 4% chance to shatter after use."
}, async (ctx, attack) => {
  const slash=document.createElement("div");
  slash.className="rainbow-sword-slash";
  document.body.appendChild(slash);
  setTimeout(()=>slash.remove(),900);
  ctx.setMessage("WIN CAN MAKE SWORD // THE RAINBOW BLADE DESCENDS.");
  ctx.showFlash();
  ctx.shake();
  return {damage:200000};
});
