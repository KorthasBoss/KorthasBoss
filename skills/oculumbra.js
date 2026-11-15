/* YEN! // OFF-SALE HELMET KISHIN // OCULUMBRA */
const OCULUMBRA_MOVES=[
  {id:"oculumbra-wailing-cathedral",name:"WAILING CATHEDRAL",power:700000000,kind:"scream",glyph:"◉",color:"#e5d8ff",nonlethal:true,description:"Oculumbra unleashes a crushing scream for up to 700,000,000 damage. It can never reduce its target below 1 HP."},
  {id:"oculumbra-deadlight-gaze",name:"DEADLIGHT GAZE",power:420000000,kind:"gaze",glyph:"◈",color:"#c8a9ff",description:"A dead-eyed stare pins the target beneath 420,000,000 damage."},
  {id:"oculumbra-grave-dance",name:"GRAVE-DANCE",power:360000000,kind:"dance",glyph:"✣",color:"#f1e7ff",description:"Oculumbra's many shadowed limbs strike in a 360,000,000-damage flurry."},
  {id:"oculumbra-black-veil",name:"BLACK VEIL // FUNERAL HUSH",power:280000000,kind:"veil",glyph:"◐",color:"#a998d9",healPercent:.08,description:"A funeral shroud deals 280,000,000 damage and restores up to 8% of Oculumbra's HP."},
  {id:"oculumbra-grasping-choir",name:"THE GRASPING CHOIR",power:240000000,kind:"choir",glyph:"♬",color:"#f8edff",skipTurns:1,skipTurnChance:.45,description:"A chorus of unseen hands deals 240,000,000 damage and has a 45% chance to steal the target's next turn."},
  {id:"oculumbra-scream-of-last-light",name:"SCREAM OF LAST LIGHT",power:1200000000,kind:"last-light",glyph:"※",color:"#fff3ff",nonlethal:true,usesPerBattle:1,description:"Oculumbra's once-per-match ultimate deals up to 1,200,000,000 damage, but always leaves its target at 1 HP."}
];

function showOculumbraEffect(move,damage){
  const effect=document.createElement("div");
  effect.className=`oculumbra-vfx oculumbra-${move.kind}`;
  effect.style.setProperty("--oculumbra-color",move.color);
  effect.setAttribute("aria-hidden","true");
  const portrait=document.createElement("img");
  portrait.className="oculumbra-portrait";
  portrait.src="assets/Oculumbra.png";
  portrait.alt="";
  const ring=document.createElement("div");
  ring.className="oculumbra-ring";
  const sigil=document.createElement("div");
  sigil.className="oculumbra-sigil";
  sigil.textContent=move.glyph;
  const title=document.createElement("div");
  title.className="oculumbra-title";
  title.textContent=move.name;
  const amount=document.createElement("div");
  amount.className="oculumbra-damage";
  amount.textContent=move.kind==="parry"
    ?`REFLECTED ${Number(damage).toLocaleString()} DAMAGE`
    :`${Number(damage).toLocaleString()} DAMAGE`;
  effect.append(portrait,ring,sigil,title,amount);
  document.body.appendChild(effect);
  window.setTimeout(()=>effect.remove(),2100);
}

window.YEN_SHOW_OCULUMBRA_PARRY=damage=>{
  showOculumbraEffect({
    name:"THE SCREAM TURNS BACK",
    kind:"parry",
    glyph:"↺",
    color:"#f2e8ff"
  },Number(damage)||0);
  window.showFlash?.();
  window.shake?.();
};

for(const move of OCULUMBRA_MOVES){
  window.YEN_REGISTER_SKILL({
    ...move,
    rarity:"OFF-SALE // OCULUMBRA",
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${move.id}-image`,
    image:"assets/Oculumbra.png",
    skillHandler:move.id,
    shopVisible:false
  },async ctx=>{
    const damage=ctx.rivalsEffect!==undefined
      ?Math.max(0,Number(ctx.rivalsEffect.damage)||0)
      :move.nonlethal
        ?Math.min(move.power,Math.max(0,Number(ctx.bossHP)-1))
        :move.power;
    let healed=Number(ctx.rivalsEffect?.heal)||0;
    if(ctx.rivalsEffect===undefined&&move.healPercent){
      const maxHP=Number(ctx.boss?.playerMaxHP)||0;
      const currentHP=Number(ctx.playerHP)||0;
      healed=Math.min(Math.max(0,maxHP-currentHP),Math.round(maxHP*move.healPercent));
      ctx.playerHP=currentHP+healed;
      ctx.updateHP?.();
    }
    showOculumbraEffect(move,damage);
    ctx.setMessage?.(`OCULUMBRA // ${move.name}`);
    ctx.showFlash?.();
    ctx.shake?.();
    await ctx.wait(1250);
    if(move.skipTurns&&ctx.state&&Math.random()<(move.skipTurnChance||1)){
      ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip)||0,move.skipTurns);
    }
    return {
      damage,
      message:`${move.name} // ${ctx.fmt(damage)} DAMAGE.${move.nonlethal?" THE TARGET REMAINS AT 1 HP.":""}${healed?` ${ctx.fmt(healed)} HP RESTORED.`:""}`
    };
  });
}
