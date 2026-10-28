/* YEN! // HELMET KISHIN // XENITH-01 */
window.YEN_REGISTER_SKILL({
  id:"xenith-01-world-weaver", name:"Xenith-01: The World Weaver", rarity:"KISHIN // WORLD WEAVER", color:"#6cf6ff", enchanted:true,
  special:"helmet-kishin", imageId:"xenith-01-card", image:"assets/Xenith-01 The World Weaver.png",
  cost:"25000000000000", power:12000000, description:"Fires a world-sized beam into the target and has a chance to restore a huge amount of your HP.",
  bio:"Xenith-01 does not swing a weapon. It edits reality. Its beam tears through the target while its woven core can feed the stolen energy back into you.",
  shopEffect:"12,000,000 DAMAGE // 45% HEAL CHANCE",
  shopVisible:false
}, async (ctx) => {
  const wrap=document.createElement("div"); wrap.className="xenith-vfx"; wrap.innerHTML='<div class="world-grid"></div><div class="world-orb"></div><div class="world-beam"></div><div class="world-collapse"></div>';
  document.body.appendChild(wrap); const target=document.querySelector("#battle-boss"); if(target){const r=target.getBoundingClientRect();wrap.style.setProperty("--tx",`${r.left+r.width/2}px`);wrap.style.setProperty("--ty",`${r.top+r.height*.4}px`);} ctx.setMessage("XENITH-01 // THE WORLD WEAVER OPENS."); ctx.showFlash(); ctx.shake(); await ctx.wait(1100); wrap.classList.add("fire"); await ctx.wait(900);
  let healed=false; if(Math.random()<0.45){const heal=Math.min(ctx.boss.playerMaxHP||2500000, 650000); ctx.playerHP=Math.min(ctx.boss.playerMaxHP,ctx.playerHP+heal); ctx.updateHP(); healed=true;}
  await ctx.wait(500); wrap.remove(); return {damage:12000000,message:healed?"XENITH-01 // WORLD BEAM // +650,000 SOUL RESTORED.":"XENITH-01 // WORLD BEAM // REALITY SPLIT."};
});
