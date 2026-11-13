const SUNTOUR_SYMBOLS=["✦","☼","◉","◇","✧"];

function showSuntourEffect(message,kind=""){
  const effect=document.createElement("div");
  effect.className=`suntour-vfx ${kind}`.trim();
  const label=document.createElement("div");
  label.className="suntour-vfx-message";
  label.textContent=message;
  effect.appendChild(label);
  document.body.appendChild(effect);
  window.setTimeout(()=>effect.remove(),1800);
}

window.YEN_SHOW_SUNTOUR_PARRY=message=>{
  showSuntourEffect(message||"CREATION OF SUNTOUR // PERFECT PARRY","parry");
};

window.YEN_CHOOSE_SUNTOUR_TRIAL=function(){
  return new Promise(resolve=>{
    const sequence=Array.from({length:4},()=>Math.floor(Math.random()*SUNTOUR_SYMBOLS.length));
    const overlay=document.createElement("div");
    overlay.className="suntour-trial";
    overlay.innerHTML='<div class="suntour-trial-panel"><p class="section-kicker">CREATION OF SUNTOUR // MEMORY TRIAL</p><h2>REBUILD THE CREATION SEQUENCE</h2><p class="suntour-trial-prompt">Memorize the four sigils. Repeat them in order before time runs out.</p><div class="suntour-trial-sequence" aria-live="polite"></div><div class="suntour-trial-progress">WATCH CLOSELY</div><div class="suntour-trial-options"></div><div class="suntour-trial-timer">6.0 SECONDS</div></div>';
    const sequenceDisplay=overlay.querySelector(".suntour-trial-sequence");
    const progress=overlay.querySelector(".suntour-trial-progress");
    const options=overlay.querySelector(".suntour-trial-options");
    sequence.forEach(index=>{
      const symbol=document.createElement("span");
      symbol.textContent=SUNTOUR_SYMBOLS[index];
      sequenceDisplay.appendChild(symbol);
    });
    SUNTOUR_SYMBOLS.forEach((symbol,index)=>{
      const button=document.createElement("button");
      button.type="button";
      button.textContent=symbol;
      button.setAttribute("aria-label",`Choose sigil ${index+1}`);
      button.disabled=true;
      options.appendChild(button);
    });
    document.body.appendChild(overlay);

    let done=false;
    let score=0;
    let timerId;
    let revealId;
    const finish=value=>{
      if(done)return;
      done=true;
      window.clearInterval(timerId);
      window.clearTimeout(revealId);
      overlay.remove();
      resolve(value);
    };
    let deadline;
    timerId=window.setInterval(()=>{
      if(deadline==null)return;
      const left=Math.max(0,deadline-Date.now());
      overlay.querySelector(".suntour-trial-timer").textContent=`${(left/1000).toFixed(1)} SECONDS`;
      if(left<=0)finish(score);
    },50);
    revealId=window.setTimeout(()=>{
      sequenceDisplay.classList.add("concealed");
      progress.textContent="REPEAT THE SIGILS";
      deadline=Date.now()+6000;
      options.querySelectorAll("button").forEach(button=>button.disabled=false);
    },1200);
    options.querySelectorAll("button").forEach((button,index)=>{
      button.addEventListener("click",()=>{
        if(index!==sequence[score]){
          progress.textContent=`BROKEN AT ${score+1}/4`;
          finish(score);
          return;
        }
        score++;
        progress.textContent=`${score}/4 CORRECT`;
        if(score===sequence.length)finish(score);
      });
    });
  });
};

async function useSuntourTrial(ctx){
  if(ctx.rivalsEffect){
    const score=Number(ctx.rivalsEffect.trialScore)||0;
    const damage=3000000+score*3000000;
    showSuntourEffect(ctx.rivalsEffect.trialPerfect
      ?"CREATION SEQUENCE PERFECT // THE RIVAL LOSES A TURN"
      :`CREATION SEQUENCE ${score}/4 // ${ctx.fmt(damage)} DAMAGE`,"trial");
    await ctx.wait(700);
    return {damage:0};
  }
  const score=await window.YEN_CHOOSE_SUNTOUR_TRIAL();
  if(score==null)return {cancelled:true};
  const damage=3000000+score*3000000;
  if(score===4)ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip||0),1);
  showSuntourEffect(`CREATION SEQUENCE ${score}/4 // ${ctx.fmt(damage)} DAMAGE`,"trial");
  await ctx.wait(700);
  return {
    damage,
    message:score===4
      ?`CREATION SEQUENCE PERFECT // ${ctx.fmt(damage)} DAMAGE. THE BOSS LOSES A TURN.`
      :`CREATION SEQUENCE ${score}/4 // ${ctx.fmt(damage)} DAMAGE.`
  };
}

window.YEN_REGISTER_SKILL({
  id:"suntour-creation-trial",
  name:"Creation Sequence",
  power:15000000,
  description:"Memorize and repeat four sigils in order. Score up to 15,000,000 damage; a perfect sequence skips the target's next turn.",
  rarity:"KISHIN // CREATION",
  color:"#a6f5c2",
  enchanted:true,
  special:"helmet-kishin",
  imageId:"suntour-creation-trial-image",
  image:"assets/Creation of suntour.png",
  shopVisible:false
},useSuntourTrial);
