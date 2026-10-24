/* YEN! // SPECIAL SKILL // NO_SAKI */
window.YEN_REGISTER_SKILL({
  id:"no-saki",
  name:"No_Saki",
  rarity:"SPECIAL // VOID",
  color:"#b40018",
  enchanted:true,
  special:"no-saki",
  cost:0,
  power:1,
  description:"The arena dies to black before a crimson message appears. Leaves the target at exactly 200 HP."
}, async (ctx) => {
  const overlay=document.createElement("div");
  overlay.className="nosaki-void";
  overlay.innerHTML="<div class=\"nosaki-line\">Well.. That's all you got?</div><div class=\"nosaki-phatatic\">Phatatic.</div>";
  document.body.appendChild(overlay);
  await ctx.wait(1500); overlay.classList.add("nosaki-hit"); await ctx.wait(750);
  return {damage:Math.max(0,ctx.bossHP-200),message:"No_Saki // The void leaves the target at 200 HP."};
});
