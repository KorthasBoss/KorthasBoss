/* JorkaPrime // three account-only attacks. Each ID is independently registered. */
(() => {
  const moves = [
    {id:'jorkaprime-crown-split',name:'CROWN-SPLIT SEVERANCE',power:18000000,color:'#ff304e',audio:'assets/jorka-won-again.mp3',label:'WON AGAIN',kind:'crown'},
    {id:'jorkaprime-horizon-ruin',name:'RUIN THE HORIZON',power:26000000,color:'#ff6a36',audio:'assets/jorka-hurt.mp3',label:'THIS WILL HURT',kind:'horizon'},
    {id:'jorkaprime-last-reason',name:'LAST REASON TO LEAVE',power:40000000,color:'#c51f3c',audio:'assets/jorka-leave-earth.mp3',label:'LEAVE EARTH',kind:'execution'}
  ];
  moves.forEach(move => window.YEN_REGISTER_SKILL({
    id:move.id,name:move.name,rarity:'JORKAPRIME // PRIME TECHNIQUE',color:move.color,
    power:move.power,enchanted:true,special:'helmet-kishin',shopVisible:false,
    description:`JorkaPrime's ${move.name} technique.`,bio:'A dedicated JorkaPrime attack with its own voice line and combat VFX.'
  }, async ctx => {
    const fx=document.createElement('div');fx.className=`jorka-vfx jorka-${move.kind}`;
    fx.innerHTML='<div class="jorka-red-scan"></div><div class="jorka-blade"></div><div class="jorka-impact"></div><div class="jorka-runes">✦　✧　✦</div>';
    document.body.appendChild(fx);
    try{const a=new Audio(move.audio);a.volume=.9;a.play().catch(()=>{});}catch{}
    ctx.setMessage(`JORKAPRIME // ${move.label} // PRIME TECHNIQUE RELEASED.`);ctx.shake();ctx.showFlash();
    await ctx.wait(180);fx.classList.add('jorka-strike');await ctx.wait(620);fx.classList.add('jorka-out');await ctx.wait(350);fx.remove();
    return {damage:move.power,message:`JorkaPrime unleashes ${move.name} for ${ctx.fmt(move.power)} damage.`};
  }));
})();
