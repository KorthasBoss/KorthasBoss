/* YEN! // HELMET KISHIN // 90K FALLEN SAMURAI */
window.YEN_REGISTER_SKILL({
  id:"fallen-samurai-90k", name:"90K Fallen Samurai", rarity:"KISHIN // SAMURAI", color:"#ff334f", enchanted:true,
  special:"helmet-kishin", imageId:"fallen-samurai-card", image:"assets/fallen-samurai.svg",
  cost:"5000000000000", power:7000000, description:"A seven-million-damage execution with a brutal chance to parry the target and steal its next turn.",
  bio:"The 90K Fallen Samurai was buried with a blade that never learned how to stop. One slash can take seven million HP, and sometimes the target is forced to kneel before answering.",
  shopEffect:"7,000,000 DAMAGE // 35% PARRY CHANCE",
  shopVisible:false
}, async (ctx) => {
  const wrap=document.createElement("div"); wrap.className="fallen-samurai-vfx"; wrap.innerHTML='<div class="samurai-cross"></div><div class="samurai-slash slash-1"></div><div class="samurai-slash slash-2"></div><div class="samurai-shock"></div>';
  document.body.appendChild(wrap); ctx.setMessage("90K FALLEN SAMURAI // DRAWN."); ctx.showFlash(); ctx.shake(); await ctx.wait(700); wrap.classList.add("strike"); await ctx.wait(650);
  const parry=Math.random()<0.35;
  if(parry){ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip||0),1);ctx.setMessage("90K FALLEN SAMURAI // PARRY. THE TARGET'S NEXT TURN IS ERASED.");}
  await ctx.wait(500); wrap.remove(); return {damage:7000000};
});
