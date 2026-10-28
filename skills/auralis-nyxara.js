/* YEN! // HELMET KISHIN // AURALIS & NYXARA */
window.YEN_REGISTER_SKILL({
  id:"auralis-nyxara", name:"Auralis & Nyxara", rarity:"KISHIN // DUO", color:"#ff6df2", enchanted:true,
  special:"helmet-kishin", imageId:"auralis-nyxara-card", image:"assets/Auralis & Nyxara.png",
  cost:"999999999999", power:1600000, usesPerBattle:4,
  description:"A brutal two-Kishin duo. Auralis and Nyxara strike together for 800,000 damage each. Four uses per battle.",
  bio:"Two hunters of the same cursed bloodline. They never attack alone. When paid for, both step into the arena and erase 800,000 HP apiece.",
  shopEffect:"800,000 DAMAGE × 2 // 4 USES PER BATTLE",
  shopVisible:false
}, async (ctx, attack) => {
  const wrap=document.createElement("div"); wrap.className="auralis-nyxara-vfx";
  wrap.innerHTML='<div class="duo-ring duo-a"></div><div class="duo-ring duo-b"></div><div class="duo-blade blade-a"></div><div class="duo-blade blade-b"></div><div class="duo-beam"></div><div class="duo-burst"></div>';
  document.body.appendChild(wrap); ctx.setMessage("AURALIS & NYXARA // DOUBLE EXECUTION."); ctx.showFlash(); ctx.shake();
  await ctx.wait(900);
  const target=document.querySelector("#battle-boss");
  if(target){const r=target.getBoundingClientRect();wrap.style.setProperty("--tx",`${r.left+r.width/2}px`);wrap.style.setProperty("--ty",`${r.top+r.height*.42}px`);}
  await ctx.wait(500); wrap.classList.add("hit");
  await ctx.wait(850); wrap.remove();
  return {damage:1600000,message:"AURALIS & NYXARA // 800,000 + 800,000 DAMAGE."};
});
