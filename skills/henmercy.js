/* YEN! // HELMET KISHIN // HENMERCY */
const HENMERCY_SKILLS = [
  {
    id:"henmercy-mercy",name:"Mercy",power:0,
    description:"Restore your HP to full."
  },
  {
    id:"henmercy-cards-wish",name:"Cards Wish",power:0,
    description:"Pick a card. Win to deal 10,000,000 damage; lose to take 4,000,000 damage and gain two turns."
  },
  {
    id:"henmercy-nornos-mask",name:"Nornos Mask",power:0,
    description:"Hide behind Nornos Mask and skip the opponent's next turn."
  },
  {
    id:"henmercy-hell-arrived",name:"You're Hell Arriveed..",power:200000,
    description:"Golden text appears and fades away, dealing exactly 200,000 damage."
  }
];

function showHenmercyEffect(message, className="") {
  const effect=document.createElement("div");
  effect.className=`henmercy-vfx ${className}`.trim();
  effect.innerHTML=`<div class="henmercy-cross henmercy-cross-one">✝</div><div class="henmercy-cross henmercy-cross-two">✝</div><div class="henmercy-cross henmercy-cross-three">✝</div><div class="henmercy-gold-message"></div>`;
  effect.querySelector(".henmercy-gold-message").textContent=message;
  document.body.appendChild(effect);
  window.setTimeout(()=>effect.remove(),1800);
  window.showFlash?.();
  window.shake?.();
  return effect;
}

window.YEN_CHOOSE_HENMERCY_CARD = function() {
  return new Promise(resolve=>{
    const overlay=document.createElement("div");
    overlay.className="henmercy-card-picker";
    overlay.innerHTML='<div class="henmercy-picker-panel"><p class="section-kicker">CARDS WISH // THREE GOLDEN CROSSES</p><h2>CHOOSE YOUR CARD</h2><p>One card wins. Pick carefully.</p><div class="henmercy-card-options"><button type="button" aria-label="Choose card 1"><span>✝</span><small>I</small></button><button type="button" aria-label="Choose card 2"><span>✝</span><small>II</small></button><button type="button" aria-label="Choose card 3"><span>✝</span><small>III</small></button></div><button type="button" class="henmercy-picker-cancel">CANCEL</button></div>';
    document.body.appendChild(overlay);
    const finish=value=>{overlay.remove();resolve(value);};
    overlay.querySelectorAll(".henmercy-card-options button").forEach((button,index)=>{
      button.addEventListener("click",()=>finish(index));
    });
    overlay.querySelector(".henmercy-picker-cancel").addEventListener("click",()=>finish(null));
  });
};

for (const skill of HENMERCY_SKILLS) {
  window.YEN_REGISTER_SKILL({
    ...skill,
    rarity:"KISHIN // HENMERCY",
    color:"#ffd45a",
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${skill.id}-image`,
    image:"assets/Henmercy.png",
    skillHandler:skill.id,
    usesPerBattle:0,
    shopVisible:false
  }, async ctx => {
    const inRivals=Boolean(ctx.rivalsEffect);
    if(skill.id==="henmercy-mercy"){
      const healed=inRivals
        ? Number(ctx.rivalsEffect.heal||0)
        : Math.max(0,Number(ctx.boss?.playerMaxHP||0)-Number(ctx.playerHP||0));
      if(!inRivals){
        ctx.playerHP=Number(ctx.boss?.playerMaxHP||ctx.playerHP||0);
        ctx.updateHP?.();
      }
      showHenmercyEffect("MERCY // HP RESTORED","mercy");
      await ctx.wait(700);
      return {damage:0,message:`MERCY // RESTORED ${ctx.fmt(healed)} HP.`};
    }

    if(skill.id==="henmercy-cards-wish"){
      let correct,cardPick;
      if(inRivals){
        correct=Boolean(ctx.rivalsEffect.cardCorrect);
        cardPick=Number(ctx.rivalsEffect.cardPick||0);
      }else{
        cardPick=await window.YEN_CHOOSE_HENMERCY_CARD();
        if(cardPick==null)return {damage:0,cancelled:true,message:"CARDS WISH // THE DRAW WAS CANCELLED."};
        correct=Math.floor(Math.random()*3)===cardPick;
      }
      showHenmercyEffect(correct?"CARDS WISH // THE OPPONENT TAKES 10,000,000":"CARDS WISH // YOU TAKE 4,000,000","cards-wish");
      await ctx.wait(850);
      if(correct)return {damage:10000000,message:"CARDS WISH // CORRECT PICK // 10,000,000 DAMAGE."};
      if(!inRivals){
        ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip||0),2);
      }
      return {damage:0,playerDamage:inRivals?0:4000000,extraTurns:2,message:"CARDS WISH // WRONG PICK // YOU TAKE 4,000,000 DAMAGE AND GAIN TWO TURNS."};
    }

    if(skill.id==="henmercy-nornos-mask"){
      showHenmercyEffect("NORNOS MASK // TURN HIDDEN","nornos-mask");
      await ctx.wait(700);
      if(!inRivals)ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip||0),1);
      return {damage:0,skipOpponentTurn:1,message:"NORNOS MASK // THE OPPONENT'S NEXT TURN IS ERASED."};
    }

    showHenmercyEffect("You're hell arriveed..","hell-arrived");
    await ctx.wait(900);
    return {damage:200000,message:"You're hell arriveed.. // 200,000 DAMAGE."};
  });
}
