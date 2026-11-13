/* YEN! // ANGELIC'S HORROR
   Independent rare Vase Gate Kishin. */
window.YEN_BOSSES = window.YEN_BOSSES || {};

const ANGELIC_ATTACKS = [
  ["SERAPHIM ERASURE", 700000, 950000], ["HALO IMPLOSION", 820000, 1100000],
  ["HEAVEN'S KNIFE", 900000, 1250000], ["FALLING CHOIR", 760000, 1180000],
  ["WHITE GRAVE", 1000000, 1400000], ["CROWN OF THORNS", 1100000, 1500000],
  ["ANGELIC EXECUTION", 1250000, 1700000], ["SILENT JUDGMENT", 900000, 1600000],
  ["WING SHATTER", 1350000, 1850000], ["DIVINE COLLAPSE", 1500000, 2050000],
  ["HEAVEN'S LAST WARNING", 1200000, 1900000], ["GRACELESS LIGHT", 1600000, 2200000],
  ["FUNERAL OF STARS", 1750000, 2400000], ["SERAPHIC REND", 1900000, 2600000],
  ["GODLESS HALO", 2100000, 2850000], ["ASCENSION BREAKER", 2300000, 3100000],
  ["LAST ANGEL", 2600000, 3500000], ["PARADISE ENDS", 2900000, 3900000],
  ["ANGELIC HORROR // ZERO", 3400000, 4700000]
];

const angelicHit = (ctx, move) => {
  const v=document.createElement("div"); v.className=`angelic-vfx ${move.vfx}`; document.body.appendChild(v);
  const d=ctx.randomInt(move.min,move.max);
  ctx.setMessage(`ANGELIC'S HORROR // ${move.name}`); ctx.showFlash(); ctx.shake();
  ctx.damagePlayer(d); ctx.updateHP();
  setTimeout(()=>v.remove(),900);
  return d;
};

async function angelicMiniGame(ctx){
  return new Promise(resolve=>{
    const overlay=document.createElement("div"); overlay.className="rare-minigame angelic-game";
    overlay.innerHTML=`<div class="rare-game-box"><div class="rare-game-kicker">ANGELIC'S HORROR // HALO TRIAL</div><h2>DODGE THE FALLING HALOS</h2><p>Click the glowing halo before it reaches the bottom. You have 5 seconds.</p><div class="halo-arena" id="halo-arena"></div><div class="rare-game-timer" id="rare-game-timer">5.0</div></div>`;
    document.body.appendChild(overlay); const arena=overlay.querySelector("#halo-arena"); const timer=overlay.querySelector("#rare-game-timer");
    let done=false, start=performance.now(), score=0, next=0;
    const finish=win=>{if(done)return;done=true;clearInterval(loop);overlay.remove();resolve(win)};
    function spawn(){const b=document.createElement("button");b.className="halo-target";b.textContent="✦";b.style.left=(8+Math.random()*84)+"%";b.onclick=()=>{score++;b.remove(); if(score>=3)finish(true)};arena.appendChild(b);setTimeout(()=>b.remove(),850)}
    const loop=setInterval(()=>{const left=Math.max(0,5000-(performance.now()-start));timer.textContent=(left/1000).toFixed(1);if(performance.now()-start>next){spawn();next+=650}if(left<=0)finish(false)},50);
  }).then(async win=>{if(win){ctx.setMessage("HALO TRIAL CLEARED. ANGELIC'S HORROR LOSES ITS TURN.");return true;}ctx.setMessage("HALO TRIAL FAILED. THE HALOS CUT THROUGH YOUR SOUL.");ctx.damagePlayer(2200000);ctx.updateHP();if(ctx.playerHP<=0)ctx.lose();return false;});
}

window.YEN_BOSSES["angelic-horror"]={
  id:"angelic-horror", hiddenFromLobby:true, name:"ANGELIC'S HORROR", stars:999999999,
  title:"THE KISHIN BEHIND THE VASE GATE", battleTitle:"THE ANGEL THAT SHOULD NOT EXIST",
  maxHP:180000000, playerMaxHP:2500000, reward:90000000000,
  idle:"assets/Angelics_horror.png", fight:"assets/Angelics_horror.png", cardImage:"assets/angelic-horror-card.svg", profileFrame:"assets/angelic-horror-card-frame.svg",
  music:"assets/angelic-horror-theme.mp3", battleBackground:"assets/angelic-horror-background.svg", hitSound:"assets/angelic-horror-hit.mp3",
  intro:["The light above you breaks.","Something holy has become completely wrong.","ANGELIC'S HORROR has accepted the invitation."],
  playerAttacks:[
    ["SOUL BREAK",250000,420000,["Your attack tears into the horror."]],["VOID CUT",300000,500000,["The cut reaches through the light."]],
    ["KISHIN IMPACT",350000,550000,["The arena buckles."]],["ABYSSAL BURST",420000,650000,["A violent burst strikes the target."]],
    ["FINAL EDGE",500000,800000,["Your strongest edge lands."]]
  ],
  hooks:{
    createState(){return {moves:ANGELIC_ATTACKS, turn:0};},
    async beforePlayerAttack(ctx,attack){
      ctx.playAudio(ctx.boss.hitSound,.95,true,false);
      const v=document.createElement("div");v.className="angelic-player-hit";document.body.appendChild(v);setTimeout(()=>v.remove(),500);
      ctx.setMessage(`ANGELIC'S HORROR HEARS THE IMPACT OF ${attack.name}.`);
      return false;
    },
    async bossTurn(ctx){
      const s=ctx.state; s.turn++;
      if(s.turn%6===0){const win=await angelicMiniGame(ctx);if(win)return;}
      const m=s.moves[Math.floor(Math.random()*s.moves.length)];
      angelicHit(ctx,{name:m[0],min:m[1],max:m[2],vfx:`vfx-${(s.turn%6)+1}`});
      if(ctx.playerHP<=0)ctx.lose(); else await ctx.wait(800);
    }
  }
};
