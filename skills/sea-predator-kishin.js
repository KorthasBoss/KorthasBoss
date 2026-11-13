/* YEN! // HELMET KISHIN // SEA PREDATOR SIGNATURE ATTACKS */
const SEA_PREDATOR_MOVES=[
  {id:"sea-kishin-abyssal-trident",name:"ABYSSAL TRIDENT",power:650000,bossMin:420000,bossMax:650000,vfx:"sea-trident-vfx",delay:650,message:"SEA PREDATOR // ABYSSAL TRIDENT"},
  {id:"sea-kishin-leviathan-crash",name:"LEVIATHAN CRASH",power:900000,bossMin:650000,bossMax:900000,vfx:"sea-crash-vfx",delay:700,message:"LEVIATHAN CRASH // THE ENTIRE ARENA BREAKS"},
  {id:"sea-kishin-tidal-guillotine",name:"TIDAL GUILLOTINE",power:850000,bossMin:850000,bossMax:850000,hits:5,damagePerHit:170000,vfx:"sea-tidal-slash",delay:115,message:"TIDAL GUILLOTINE // FIVE OCEAN BLADES"},
  {id:"sea-kishin-shell-judgment",name:"SHELL JUDGMENT",power:1150000,bossMin:800000,bossMax:1150000,vfx:"sea-shell-judgment-vfx",delay:800,message:"SHELL JUDGMENT // THE KISHIN SHELL OPENS"},
  {id:"sea-kishin-black-tide",name:"BLACK TIDE",power:1350000,bossMin:950000,bossMax:1350000,vfx:"sea-black-tide-vfx",delay:900,message:"BLACK TIDE // THE SEA FORGETS YOUR NAME"},
  {id:"sea-kishin-ocean-devourer",name:"OCEAN DEVOURER",power:1700000,bossMin:1200000,bossMax:1700000,vfx:"sea-devour-vfx",delay:1000,message:"OCEAN DEVOURER // EVERYTHING GETS DRAGGED UNDER"},
  {id:"sea-kishin-co-op-trident",name:"CO-OP TRIDENT // ABYSSAL EXECUTION",power:2400000,bossMin:1800000,bossMax:2400000,vfx:"sea-coop-vfx",delay:1100,message:"CO-OP TRIDENT // ABYSSAL EXECUTION"}
];

for(const move of SEA_PREDATOR_MOVES){
  window.YEN_REGISTER_SKILL({
    ...move,
    description:move.hits
      ?`${move.message}: ${move.hits} hits of ${move.damagePerHit.toLocaleString()} damage each.`
      :`${move.message}: ${move.bossMin.toLocaleString()}-${move.bossMax.toLocaleString()} damage.`,
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
      ?Number(ctx.rivalsEffect.damage??move.power)
      :Math.floor(Math.random()*(move.bossMax-move.bossMin+1))+move.bossMin;
    ctx.setMessage?.(move.message);
    if(move.hits){
      for(let hit=1;hit<=move.hits;hit++){
        const effect=document.createElement("div");
        effect.className=move.vfx;
        effect.style.setProperty("--sea-index",String(hit));
        document.body.appendChild(effect);
        window.shake?.();
        ctx.setMessage?.(`${move.name} // ${hit}/${move.hits}. ${ctx.fmt(move.damagePerHit)} DAMAGE.`);
        await ctx.wait(move.delay);
        effect.remove();
      }
    }else{
      const effect=document.createElement("div");
      effect.className=move.vfx;
      document.body.appendChild(effect);
      window.showFlash?.();
      window.shake?.();
      await ctx.wait(move.delay);
      window.showFlash?.();
      window.shake?.();
      await ctx.wait(650);
      effect.remove();
    }
    return {damage,message:`${move.message} // ${ctx.fmt(damage)} DAMAGE.`};
  });
}
