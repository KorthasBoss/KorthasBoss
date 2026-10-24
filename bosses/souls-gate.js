/* YEN! // SOUL'S GATE
   Independent rare Vase Gate Kishin. */
window.YEN_BOSSES = window.YEN_BOSSES || {};

const SOULS_ATTACKS = [
  ["GATE CRUSH", 800000, 1050000], ["SOUL LOCK", 900000, 1200000],
  ["BLACK THRESHOLD", 950000, 1300000], ["CHAIN OF NOTHING", 1050000, 1450000],
  ["GRAVEWAY", 1150000, 1550000], ["GATEKEEPER'S HAND", 1300000, 1750000],
  ["ABYSS DOOR", 1450000, 1950000], ["SIXTH SEAL", 1500000, 2100000],
  ["SOUL FRACTURE", 1650000, 2250000], ["DEAD WORLD", 1800000, 2450000],
  ["LOCKED HEAVEN", 1950000, 2600000], ["BLACK SUN", 2100000, 2800000],
  ["GATE OF KINGS", 2250000, 3000000], ["ETERNAL SENTENCE", 2400000, 3250000],
  ["SOUL HARVEST", 2600000, 3500000], ["FINAL LOCK", 2800000, 3800000],
  ["NO EXIT", 3000000, 4100000], ["THE GATE OPENS", 3300000, 4500000],
  ["SOUL'S GATE // OBLIVION", 3800000, 5200000]
];

async function soulsMiniGame(ctx){
  return new Promise(resolve=>{
    const symbols=["◆","◇","✦","✧"]; const sequence=[...symbols].sort(()=>Math.random()-.5).slice(0,3);
    const overlay=document.createElement("div");overlay.className="rare-minigame souls-game";
    overlay.innerHTML=`<div class="rare-game-box"><div class="rare-game-kicker">SOUL'S GATE // LOCK TRIAL</div><h2>OPEN THE CORRECT GATE</h2><p>Memorize the three symbols, then press them in order. You have 6 seconds.</p><div class="soul-sequence">${sequence.map(x=>`<span>${x}</span>`).join("")}</div><div class="soul-buttons">${symbols.map(x=>`<button data-symbol="${x}">${x}</button>`).join("")}</div><div class="rare-game-timer" id="rare-game-timer">6.0</div></div>`;
    document.body.appendChild(overlay);const buttons=[...overlay.querySelectorAll(".soul-buttons button")],timer=overlay.querySelector("#rare-game-timer");let index=0,done=false,start=performance.now();
    const finish=win=>{if(done)return;done=true;clearInterval(loop);overlay.remove();resolve(win)};
    buttons.forEach(b=>b.onclick=()=>{if(b.dataset.symbol!==sequence[index])return finish(false);index++;b.disabled=true;if(index===sequence.length)finish(true)});
    const loop=setInterval(()=>{const left=Math.max(0,6000-(performance.now()-start));timer.textContent=(left/1000).toFixed(1);if(left<=0)finish(false)},50);
  }).then(async win=>{if(win){ctx.setMessage("LOCK TRIAL CLEARED. SOUL'S GATE LOSES ITS TURN.");return true;}ctx.setMessage("LOCK TRIAL FAILED. SOUL'S GATE CLOSES AROUND YOU.");ctx.damagePlayer(2600000);ctx.updateHP();if(ctx.playerHP<=0)ctx.lose();return false;});
}

window.YEN_BOSSES["souls-gate"]={
  id:"souls-gate",hiddenFromLobby:true,name:"SOUL'S GATE",stars:888888888,
  title:"THE KISHIN THAT GUARDS THE LAST DOOR",battleTitle:"THERE IS NO EXIT",
  maxHP:210000000,playerMaxHP:2800000,reward:120000000000,
  idle:"assets/Souls_gate.png",fight:"assets/Souls_gate.png",cardImage:"assets/souls-gate-card.svg",profileFrame:"assets/souls-gate-card-frame.svg",
  music:"assets/souls-gate-theme.mp3",battleBackground:"assets/souls-gate-background.svg",hitSound:"assets/souls-gate-hit.mp3",
  intro:["A door appears where the arena used to be.","It opens without moving.","SOUL'S GATE is waiting on the other side."],
  playerAttacks:[
    ["SOUL BREAK",250000,420000,["Your attack strikes the gate."]],["VOID CUT",300000,500000,["The darkness splits."]],
    ["KISHIN IMPACT",350000,550000,["The gate trembles."]],["ABYSSAL BURST",420000,650000,["The arena cracks."]],
    ["FINAL EDGE",500000,800000,["Your strongest edge lands."]]
  ],
  hooks:{
    createState(){return {moves:SOULS_ATTACKS,turn:0};},
    async beforePlayerAttack(ctx,attack){
      ctx.playAudio(ctx.boss.hitSound,.95,true,false);
      const v=document.createElement("div");v.className="souls-player-hit";document.body.appendChild(v);setTimeout(()=>v.remove(),550);
      ctx.setMessage(`SOUL'S GATE RECEIVES ${attack.name}. THE GATE REMEMBERS THE IMPACT.`);
      return false;
    },
    async bossTurn(ctx){
      const s=ctx.state;s.turn++;
      if(s.turn%5===0){const win=await soulsMiniGame(ctx);if(win)return;}
      const m=s.moves[Math.floor(Math.random()*s.moves.length)];
      const v=document.createElement("div");v.className=`souls-vfx vfx-${(s.turn%6)+1}`;document.body.appendChild(v);
      const d=ctx.randomInt(m[1],m[2]);ctx.setMessage(`SOUL'S GATE // ${m[0]}`);ctx.showFlash();ctx.shake();ctx.damagePlayer(d);ctx.updateHP();setTimeout(()=>v.remove(),950);
      if(ctx.playerHP<=0)ctx.lose();else await ctx.wait(850);
    }
  }
};
