/* YEN! // OFF-SALE HELMET KISHIN // KING&HELL */
const KING_HELL_MOVES=[
  {id:"king-hell-royal-maw",name:"ROYAL MAW // CROWN-CRUSHER",power:18000000,kind:"maw",glyph:"☠",color:"#ffb347",description:"King&Hell's jaws snap shut around the target for 18,000,000 damage."},
  {id:"king-hell-fang-storm",name:"FANG STORM // RED HAIL",power:22500000,kind:"fangs",glyph:"⌁",color:"#ff5266",description:"A storm of burning fangs rakes the target for 22,500,000 damage."},
  {id:"king-hell-hellfire-snap",name:"HELLFIRE SNAP",power:28000000,kind:"fire",glyph:"♨",color:"#ff6a32",description:"A flaming bite detonates against the target for 28,000,000 damage."},
  {id:"king-hell-thronefall",name:"THRONEFALL // ROYAL EXECUTION",power:36000000,kind:"throne",glyph:"♛",color:"#ffd36e",description:"King&Hell drops its infernal throne on the target for 36,000,000 damage."},
  {id:"king-hell-chain-rake",name:"CHAIN-RAKE // NO ESCAPE",power:14500000,kind:"chain",glyph:"⛓",color:"#ff8d45",skipTurnChance:.18,skipTurns:1,description:"A hooked chain lashes the target for 14,500,000 damage and has an 18% chance to steal its next turn."},
  {id:"king-hell-blacktongue",name:"BLACKTONGUE VENOM",power:12500000,kind:"venom",glyph:"✣",color:"#9aff4f",skipTurnChance:.25,skipTurns:1,description:"A toxic bite deals 12,500,000 damage and has a 25% chance to poison away the target's next turn."},
  {id:"king-hell-grave-howl",name:"GRAVE-HOWL // EARTHQUAKE",power:16500000,kind:"howl",glyph:"◎",color:"#dc70ff",skipTurnChance:.15,skipTurns:1,description:"A soul-rattling howl deals 16,500,000 damage and has a 15% chance to stagger the target."},
  {id:"king-hell-shadow-pounce",name:"SHADOW POUNCE",power:24000000,kind:"pounce",glyph:"➤",color:"#bb91ff",description:"King&Hell vanishes, then pounces from the target's shadow for 24,000,000 damage."},
  {id:"king-hell-ironhide",name:"IRONHIDE // GNAWING GUARD",power:10000000,kind:"iron",glyph:"⬟",color:"#9ed8ff",healPercent:.05,description:"An armored shoulder-check deals 10,000,000 damage and restores up to 5% of King&Hell's maximum HP."},
  {id:"king-hell-feast-eternal",name:"FEAST ETERNAL",power:0,kind:"feast",glyph:"◉",color:"#ff4d73",healPercent:.12,description:"King&Hell devours a soul to restore up to 12% of its maximum HP."},
  {id:"king-hell-blood-tax",name:"BLOOD TAX // RED TITHE",power:21000000,kind:"blood",glyph:"✕",color:"#ff3158",healPercent:.04,description:"A brutal bite deals 21,000,000 damage and restores up to 4% of King&Hell's maximum HP."},
  {id:"king-hell-coffin-bite",name:"COFFIN-BITE // LID SLAM",power:27000000,kind:"coffin",glyph:"▰",color:"#a78b72",skipTurns:1,description:"The target is snapped into an iron coffin for 27,000,000 damage and loses its next turn."},
  {id:"king-hell-devour-moon",name:"DEVOUR THE MOON",power:32500000,kind:"moon",glyph:"◐",color:"#bca8ff",description:"A black moon opens its jaws and swallows the target's light for 32,500,000 damage."},
  {id:"king-hell-bone-wheel",name:"BONE-WHEEL // GRINDER",power:23500000,kind:"wheel",glyph:"◉",color:"#f1e4c4",description:"A spinning ring of bone-teeth grinds the target for 23,500,000 damage."},
  {id:"king-hell-crown-of-teeth",name:"CROWN OF TEETH",power:19000000,kind:"crown",glyph:"♜",color:"#ffd36e",skipTurnChance:.22,skipTurns:1,description:"A crown of fangs deals 19,000,000 damage and has a 22% chance to leave the target reeling."},
  {id:"king-hell-hellgate-crush",name:"HELLGATE CRUSH",power:42000000,kind:"gate",glyph:"▥",color:"#ff5938",description:"The gates of Hell slam shut on the target for 42,000,000 damage."},
  {id:"king-hell-royal-guard",name:"ROYAL GUARD // UNDYING HIDE",power:0,kind:"guard",glyph:"⬢",color:"#ffc66e",healPercent:.08,description:"King&Hell raises its shield and restores up to 8% of its maximum HP."},
  {id:"king-hell-pack-hunt",name:"PACK HUNT // TWO SHADOWS",power:34500000,kind:"pack",glyph:"Ⅱ",color:"#ff8061",skipTurnChance:.2,skipTurns:1,description:"Both heads strike for 34,500,000 damage and have a 20% chance to overwhelm the target's next turn."},
  {id:"king-hell-endless-maw",name:"ENDLESS MAW // EAT THE ARENA",power:50000000,kind:"end",glyph:"∞",color:"#ff3c4e",usesPerBattle:1,description:"King&Hell's final, once-per-match attack devours the arena for 50,000,000 damage."}
];

function showKingHellEffect(move){
  const effect=document.createElement("div");
  effect.className=`king-hell-vfx kh-${move.kind}`;
  effect.style.setProperty("--king-hell-color",move.color);
  effect.setAttribute("aria-hidden","true");
  const portrait=document.createElement("img");
  portrait.className="king-hell-portrait";
  portrait.src="assets/King&Hell.png";
  portrait.alt="";
  const impact=document.createElement("div");
  impact.className="king-hell-impact";
  const mark=document.createElement("div");
  mark.className="king-hell-mark";
  mark.textContent=move.glyph;
  const title=document.createElement("div");
  title.className="king-hell-move-title";
  title.textContent=move.name;
  effect.append(portrait,impact,mark,title);
  document.body.appendChild(effect);
  return effect;
}

for(const move of KING_HELL_MOVES){
  window.YEN_REGISTER_SKILL({
    ...move,
    rarity:"OFF-SALE // KING&HELL",
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${move.id}-image`,
    image:"assets/King&Hell.png",
    skillHandler:move.id,
    shopVisible:false
  },async ctx=>{
    const inRivals=ctx.rivalsEffect!==undefined;
    const effect=showKingHellEffect(move);
    ctx.setMessage?.(`KING&HELL // ${move.name}`);
    ctx.showFlash?.();
    ctx.shake?.();
    await ctx.wait(1250);
    effect.remove();

    let healed=0;
    if(move.healPercent){
      if(inRivals)healed=Number(ctx.rivalsEffect.heal)||0;
      else{
        const maxHP=Number(ctx.boss?.playerMaxHP)||0;
        const currentHP=Number(ctx.playerHP)||0;
        healed=Math.min(Math.max(0,maxHP-currentHP),Math.round(maxHP*move.healPercent));
        ctx.playerHP=currentHP+healed;
        ctx.updateHP?.();
      }
    }
    if(move.skipTurns&&!inRivals&&(!move.skipTurnChance||Math.random()<move.skipTurnChance)){
      ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip)||0,move.skipTurns);
    }
    const damage=Number(ctx.rivalsEffect?.damage??move.power);
    return {damage,message:`${move.name} // ${ctx.fmt(damage)} DAMAGE.${healed?` ${ctx.fmt(healed)} HP RESTORED.`:""}`};
  });
}

window.YEN_PLAY_KING_HELL_BITE=(damage)=>{
  const effect=document.createElement("div");
  effect.className="king-hell-bite-vfx";
  effect.setAttribute("aria-hidden","true");
  const portrait=document.createElement("img");
  portrait.src="assets/King&Hell.png";
  portrait.alt="";
  const label=document.createElement("strong");
  label.textContent="KING&HELL BITES BACK";
  const amount=document.createElement("span");
  amount.textContent=`-${Number(damage).toLocaleString()} HP`;
  effect.append(portrait,label,amount);
  document.body.appendChild(effect);
  window.setTimeout(()=>effect.remove(),1450);
};
