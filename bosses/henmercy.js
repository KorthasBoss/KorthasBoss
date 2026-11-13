/* YEN! // HENMERCY // GOLDEN KISHIN */
window.YEN_BOSSES = window.YEN_BOSSES || {};

const HENMERCY_BOSS_MOVES = [
  {name:"GOLDEN VERDICT",damage:[950000,1250000]},
  {name:"CHOIR OF THORNS",hits:4,damagePerHit:260000},
  {name:"SERAPHIC LANCE",damage:[1200000,1500000]},
  {name:"CROWN OF SANCTITY",damage:[1400000,1700000]},
  {name:"WINGS OF LAST DAWN",damage:[1250000,1650000]},
  {name:"NORNOS DECREE",damage:[1550000,1900000]},
  {name:"FINAL MERCY",damage:[1850000,2250000]},
  {name:"HALO OF SILENCE",damage:[900000,1200000]},
  {name:"MERCY UNENDING",heal:350000000},
  {name:"CARDS WISH",game:"cards",damage:[1000000,1350000]},
  {name:"CROSS TRIAL",game:"cross",damage:[1100000,1450000]},
  {name:"HALO SEQUENCE",game:"halo",damage:[1200000,1550000]},
  {name:"BELL OF ABSOLUTION",game:"bell",damage:[1350000,1700000]}
];

const HENMERCY_GAMES = {
  cards:{title:"CARDS WISH",prompt:"One sealed card carries the true cross. Choose before the bells fade.",symbols:["I","II","III"]},
  cross:{title:"CROSS TRIAL",prompt:"Remember the sacred mark, then find it among the false signs.",symbols:["✝","✦","◉"]},
  halo:{title:"HALO SEQUENCE",prompt:"The halo flashes once. Choose the symbol you saw.",symbols:["☼","✧","✥"]},
  bell:{title:"BELL OF ABSOLUTION",prompt:"A bell rings once. Match its echo before the final toll.",symbols:["Ⅰ","Ⅱ","Ⅲ"]}
};

const HENMERCY_PHASES = [
  {threshold:0.75,damageMultiplier:2,name:"THE CURSE AWAKENS",message:"PHASE TWO // THE CURSE AWAKENS. HENMERCY'S attacks double in force."},
  {threshold:0.5,damageMultiplier:4,name:"THE HALO BREAKS",message:"PHASE THREE // THE HALO BREAKS. HENMERCY's power doubles again."},
  {threshold:0.25,damageMultiplier:8,name:"EIGHTFOLD ABOMINATION",message:"PHASE FOUR // EIGHTFOLD ABOMINATION. HENMERCY unleashes the full curse."}
];

function henmercyDamage(ctx,damage){
  return Math.round(damage*(HENMERCY_PHASES[ctx.state.stage-2]?.damageMultiplier||1));
}

function showHenmercyBossVfx(message,kind=""){
  const effect=document.createElement("div");
  effect.className=`henmercy-vfx ${kind}`.trim();
  effect.innerHTML='<div class="henmercy-cross henmercy-cross-one">✝</div><div class="henmercy-cross henmercy-cross-two">✝</div><div class="henmercy-cross henmercy-cross-three">✝</div><div class="henmercy-gold-message"></div>';
  effect.querySelector(".henmercy-gold-message").textContent=message;
  document.body.appendChild(effect);
  window.setTimeout(()=>effect.remove(),1800);
}

function henmercyGame(ctx,type){
  return new Promise(resolve=>{
    const game=HENMERCY_GAMES[type];
    const target=Math.floor(Math.random()*game.symbols.length);
    const duration=[7000,5500,4000,3000][Math.min(3,ctx.state.stage-1)];
    const overlay=document.createElement("div");
    overlay.className=`henmercy-boss-game stage-${ctx.state.stage}`;
    overlay.innerHTML=`<div class="henmercy-boss-game-panel"><p class="section-kicker">HENMERCY // HOLY SKILL CHECK // STAGE ${ctx.state.stage}</p><h2>${game.title}</h2><p class="henmercy-boss-game-prompt">${game.prompt}</p><div class="henmercy-game-sigil">${game.symbols[target]}</div><div class="henmercy-boss-game-options"></div><div class="henmercy-boss-game-timer">${(duration/1000).toFixed(1)}</div></div>`;
    const options=overlay.querySelector(".henmercy-boss-game-options");
    game.symbols.forEach((symbol,index)=>{
      const button=document.createElement("button");
      button.type="button";
      button.textContent=symbol;
      button.setAttribute("aria-label",`Choose symbol ${index+1}`);
      button.addEventListener("click",()=>finish(index===target));
      options.appendChild(button);
    });
    document.body.appendChild(overlay);

    let done=false;
    const deadline=Date.now()+duration;
    const timer=window.setInterval(()=>{
      const left=Math.max(0,deadline-Date.now());
      overlay.querySelector(".henmercy-boss-game-timer").textContent=`${(left/1000).toFixed(1)} SECONDS`;
      if(left<=0)finish(false);
    },50);
    const finish=success=>{
      if(done)return;
      done=true;
      window.clearInterval(timer);
      overlay.remove();
      resolve(success);
    };
    ctx.wait(900).then(()=>overlay.classList.add("ready"));
  });
}

window.YEN_BOSSES.henmercy = {
  id:"henmercy",
  name:"HENMERCY",
  stars:700000000,
  title:"THE GOLDEN KISHIN // FOUR CURSE STAGES",
  battleTitle:"THE HEAVENLY COURT HAS CHOSEN YOU",
  maxHP:8000000000,
  playerMaxHP:28000000,
  reward:250000000000,
  cardImage:"assets/Henmercy.png",
  idle:"assets/Henmercy.png",
  fight:"assets/Henmercy.png",
  music:"assets/korthas-theme.mp3",
  battleBackground:"assets/royal.jpg",
  battleClass:"henmercy-battle",
  readyMessage:"Well. Its time to show you why curses are really dangerus.",
  moves:HENMERCY_BOSS_MOVES,
  intro:["Well.","Its time to show you why curses are really dangerus.","A golden cross burns into the floor.","Four wings unfold behind a smiling mask."],
  playerAttacks:[
    ["HUNTER'S CUT",260000,390000,["Your blade crosses the golden light.","The impact ripples through the chapel."]],
    ["WARD BREAKER",340000,510000,["You force a path through the radiance.","A fracture appears in the halo."]],
    ["LAST LIGHT",420000,620000,["Your strike catches Henmercy between blessings.","The golden wings recoil."]]
  ],
  hooks:{
    createState(){return {turn:0,stage:1};},
    async afterPlayerHit(ctx){
      while(ctx.state.stage<=HENMERCY_PHASES.length){
        const nextPhase=HENMERCY_PHASES[ctx.state.stage-1];
        if(ctx.bossHP>ctx.boss.maxHP*nextPhase.threshold)return;
        ctx.state.stage++;
        const phase=HENMERCY_PHASES[ctx.state.stage-2];
        ctx.setPhase(`PHASE ${ctx.state.stage} // HENMERCY`);
        ctx.setStatus(phase.name);
        showHenmercyBossVfx(phase.name,"phase-change");
        ctx.setMessage(phase.message);
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(900);
      }
    },
    async bossTurn(ctx){
      const move=ctx.pick(ctx.boss.moves);
      ctx.state.turn++;
      if(move.game){
        ctx.setMessage(`HENMERCY // ${move.name}. THE HOLY TRIAL BEGINS.`);
        const passed=await henmercyGame(ctx,move.game);
        if(passed){
          const opening=100000000*ctx.state.stage;
          ctx.applyBossDamage(opening);
          ctx.updateHP();
          ctx.setMessage(`HOLY TRIAL CLEARED // ${ctx.fmt(opening)} DAMAGE. HENMERCY LOSES THIS TURN.`);
          ctx.showFlash();
          ctx.shake();
          if(ctx.bossHP<=0)await ctx.completeVictory(ctx.boss.reward,ctx.boss.name);
          return;
        }
        await this.hit(ctx,move,henmercyDamage(ctx,ctx.randomInt(...move.damage)),`THE ${move.name} IS FAILED. THE GOLDEN CROSS DESCENDS.`);
        return;
      }
      if(move.heal){
        const stageMultiplier=[1,2,4,8][Math.min(3,ctx.state.stage-1)];
        const healed=Math.min(move.heal*stageMultiplier,ctx.boss.maxHP-ctx.bossHP);
        ctx.bossHP+=healed;
        showHenmercyBossVfx("MERCY UNENDING // THE GOLDEN WINGS REFORM","mercy");
        ctx.updateHP();
        ctx.setMessage(`MERCY UNENDING // HENMERCY RESTORES ${ctx.fmt(healed)} HP.`);
        await ctx.wait(850);
        return;
      }
      if(move.hits){
        showHenmercyBossVfx(`${move.name} // FOUR CROSSES FALL`);
        for(let hit=1;hit<=move.hits;hit++){
          if(ctx.playerHP<=0)return;
          const damage=Math.min(ctx.playerHP,henmercyDamage(ctx,move.damagePerHit));
          ctx.damagePlayer(damage);
          ctx.updateHP();
          ctx.setMessage(`${move.name} // ${hit}/${move.hits} // ${ctx.fmt(damage)} DAMAGE.`);
          ctx.shake();
          await ctx.wait(180);
        }
        if(ctx.playerHP<=0)ctx.lose();
        return;
      }
      await this.hit(ctx,move,henmercyDamage(ctx,ctx.randomInt(...move.damage)),`HENMERCY // ${move.name}`);
    },
    async hit(ctx,move,damage,message){
      showHenmercyBossVfx(move.name);
      ctx.setMessage(message);
      await ctx.wait(700);
      ctx.showFlash();
      ctx.shake();
      const dealt=Math.min(ctx.playerHP,damage);
      ctx.damagePlayer(dealt);
      ctx.updateHP();
      ctx.setMessage(`${move.name} // YOU TAKE ${ctx.fmt(dealt)} DAMAGE.`);
      await ctx.wait(650);
      if(ctx.playerHP<=0)ctx.lose();
    }
  }
};
