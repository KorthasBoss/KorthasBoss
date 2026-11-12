/* YEN! // HELMET KISHIN // JAPANHUNTER */
window.YEN_REGISTER_SKILL({
  id:"japanhunter",
  name:"JapanHunter",
  rarity:"KISHIN // MYTHIC HUNTER",
  color:"#ff7b32",
  enchanted:true,
  special:"helmet-kishin",
  imageId:"japanhunter-card",
  image:"assets/JapanHunter.png",
  cost:"999999999999999999999999999999",
  power:1000000000000,
  description:"JapanHunter draws the final blade beneath a burning sun, dealing exactly 1,000,000,000,000 damage.",
  bio:"A mythic hunter that never loses its target. Its arrival turns the arena into a red-sun execution ground.",
  shopEffect:"1,000,000,000,000 DAMAGE // RED SUN EXECUTION",
  shopVisible:false
}, async ctx => {
  const arena=document.createElement("div");
  arena.className="japanhunter-vfx";
  arena.innerHTML='<div class="japanhunter-sun"></div><div class="japanhunter-rings"></div><div class="japanhunter-kanji">狩</div><div class="japanhunter-blade"></div><div class="japanhunter-impact"></div>';
  document.body.appendChild(arena);
  const target=window.YEN_GET_BATTLE_TARGET?.();
  if(target){
    const rect=target.getBoundingClientRect();
    arena.style.setProperty("--japanhunter-x",`${rect.left+rect.width/2}px`);
    arena.style.setProperty("--japanhunter-y",`${rect.top+rect.height*.42}px`);
  }
  ctx.setMessage("JAPANHUNTER // THE RED SUN RISES. YOUR FATE IS SEALED.");
  ctx.showFlash();
  ctx.shake();
  await ctx.wait(700);
  arena.classList.add("japanhunter-strike");
  ctx.setMessage("JAPANHUNTER // ONE BLADE. ONE TARGET. NO ESCAPE.");
  await ctx.wait(650);
  arena.classList.add("japanhunter-impact");
  ctx.setMessage("JAPANHUNTER // NIHON NO OWARI.");
  await ctx.wait(700);
  arena.remove();
  return {
    damage:1000000000000,
    message:"JAPANHUNTER // NIHON NO OWARI // 1,000,000,000,000 DAMAGE."
  };
});
