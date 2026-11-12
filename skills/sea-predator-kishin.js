/* YEN! // HELMET KISHIN // SEA PREDATOR SIGNATURE ATTACKS */
const SEA_PREDATOR_MOVES=[
  {id:"sea-kishin-abyssal-trident",name:"Abyssal Trident",power:650000,bossMin:420000,bossMax:650000},
  {id:"sea-kishin-leviathan-crash",name:"Leviathan Crash",power:900000,bossMin:650000,bossMax:900000},
  {id:"sea-kishin-tidal-guillotine",name:"Tidal Guillotine",power:850000,bossMin:850000,bossMax:850000},
  {id:"sea-kishin-shell-judgment",name:"Shell Judgment",power:1150000,bossMin:800000,bossMax:1150000},
  {id:"sea-kishin-black-tide",name:"Black Tide",power:1350000,bossMin:950000,bossMax:1350000},
  {id:"sea-kishin-ocean-devourer",name:"Ocean Devourer",power:1700000,bossMin:1200000,bossMax:1700000},
  {id:"sea-kishin-co-op-trident",name:"Co-op Trident // Abyssal Execution",power:2400000,bossMin:1800000,bossMax:2400000}
];

for(const move of SEA_PREDATOR_MOVES){
  window.YEN_REGISTER_SKILL({
    ...move,
    description:`Sea Predator's signature ${move.name} from its boss encounter.`,
    rarity:"KISHIN // ABYSSAL PREDATOR",
    color:"#3be7dc",
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${move.id}-image`,
    image:"assets/sea-predator.png",
    skillHandler:move.id,
    shopVisible:false
  },async ctx=>{
    const damage=ctx.rivalsEffect
      ?move.power
      :Math.floor(Math.random()*(move.bossMax-move.bossMin+1))+move.bossMin;
    const effect=document.createElement("div");
    effect.className=`sea-kishin-vfx ${move.id}`;
    effect.innerHTML='<div class="sea-kishin-wave"></div><div class="sea-kishin-impact"></div><div class="sea-kishin-title"></div>';
    effect.querySelector(".sea-kishin-title").textContent=move.name.toUpperCase();
    document.body.appendChild(effect);
    window.showFlash?.();
    window.shake?.();
    ctx.setMessage?.(`${move.name.toUpperCase()} // THE ABYSSAL SHELL OPENS.`);
    await ctx.wait(800);
    effect.remove();
    return {damage,message:`${move.name.toUpperCase()} // ${ctx.fmt(damage)} DAMAGE.`};
  });
}
