/*
==========================================================
 YEN! // NEBULA
==========================================================
NEBULA IS FULLY SELF-CONTAINED.
She cannot parry. Instead, she can reflect attacks back at
full calculated damage, or sometimes barely feel them.
Her card attack makes her an even larger threat.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.nebula = {
  id: "nebula",
  name: "NEBULA",
  stars: 100000000,
  title: "THE STAR-EATING ABYSS",
  battleTitle: "SHE DOES NOT NEED TO PARRY",
  maxHP: 50000000,
  playerMaxHP: 1500000,
  reward: 15000000000,
  intro: ["The stars have gone silent.", "NEBULA is waiting.", "Now show me what your attack is worth."],

  // Replace these with final Nebula art/background whenever ready.
  cardImage: "assets/Nebula.png",
  profileFrame: "assets/Nebula _Card.png",
  idle: "assets/Nebula.png",
  fight: "assets/Nebula.png",
  music: "assets/oceans.mp3",
  battleBackground: "assets/royal.jpg",
  reflectChance: 0.46,
  ignoreChance: 0.27,
  empoweredReflection: 1.0,

  playerAttacks: [
     ["SLASH",9000,21000,["Your void slash reaches Aethelgard.","The hit sparks against his armor."]],
    ["LAST WORD",12000,20000,["Your final word strikes the True Final Lord.","The air fractures around Aethelgard."]]
  ],

  attacks: {
    gravityCollapse: {name:"GRAVITY COLLAPSE", damage:[120000,220000]},
    starDevourer: {name:"STAR DEVOURER", damage:[160000,260000]},
    cosmicRain: {name:"COSMIC RAIN", hits:8, damagePerHit:24000},
    eventHorizon: {name:"EVENT HORIZON", damage:[200000,330000]},
    cardDraw: {name:"VOID CARD DRAW", successDamage:260000, failDamage:[300000,420000], timeLimit:5000}
  },

  hooks: {
    createState() { return {cardBusy:false, nextReflectBoost:1}; },

    async beforePlayerAttack(ctx, attack) {
      const range=ctx.attackToRange(attack);
      const incoming=ctx.randomInt(range.min,range.max);

      if(Math.random() < ctx.boss.reflectChance) {
        const reflected=Math.min(ctx.playerHP,Math.max(1,Math.round(incoming*ctx.state.nextReflectBoost*ctx.boss.empoweredReflection)));
        ctx.state.nextReflectBoost=1;
        const v=document.createElement("div"); v.className="nebula-reflect-vfx"; document.body.appendChild(v);
        ctx.setMessage(`NEBULA REFLECTS ${attack.name}. THE ATTACK IS THROWN BACK AT YOU.`);
        ctx.showFlash(); ctx.shake();
        await ctx.wait(300);
        ctx.damagePlayer(reflected); ctx.updateHP();
        ctx.setMessage(`COSMIC REFLECTION // ${ctx.fmt(reflected)} DAMAGE RETURNED.`);
        await ctx.wait(700); v.remove();
        if(ctx.playerHP<=0) ctx.lose();
        return true;
      }

      if(Math.random() < ctx.boss.ignoreChance) {
        const fixed=20000;
        attack._nebulaFixedDamage=fixed;
        ctx.setMessage("NEBULA DOESN'T EVEN FLINCH. THE ATTACK BARELY MATTERS.");
        ctx.addMessageClass("nebula-null-text");
        const v=document.createElement("div"); v.className="nebula-null-vfx"; document.body.appendChild(v);
        ctx.showFlash(); await ctx.wait(500); v.remove();
        ctx.removeMessageClass("nebula-null-text");
        return false;
      }

      return false;
    },

    async bossTurn(ctx) {
      const roll=Math.random();
      if(roll<0.22){await this.gravityCollapse(ctx);return;}
      if(roll<0.43){await this.starDevourer(ctx);return;}
      if(roll<0.67){await this.cosmicRain(ctx);return;}
      if(roll<0.82){await this.eventHorizon(ctx);return;}
      await this.cardDraw(ctx);
    },

    async gravityCollapse(ctx){
      const d=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.gravityCollapse.damage));
      const v=document.createElement("div");v.className="nebula-gravity-vfx";document.body.appendChild(v);
      ctx.setMessage("NEBULA // GRAVITY COLLAPSE"); await ctx.wait(500);ctx.showFlash();ctx.shake();
      ctx.damagePlayer(d);ctx.updateHP();ctx.setMessage(`GRAVITY COLLAPSE crushes you for ${ctx.fmt(d)} damage.`);await ctx.wait(650);v.remove();
      if(ctx.playerHP<=0)ctx.lose();
    },

    async starDevourer(ctx){
      const d=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.starDevourer.damage));
      const v=document.createElement("div");v.className="nebula-devour-vfx";document.body.appendChild(v);
      ctx.setMessage("NEBULA OPENS HER MOUTH TO THE STARS.");await ctx.wait(650);ctx.showFlash();ctx.shake();
      ctx.damagePlayer(d);ctx.updateHP();ctx.setMessage(`STAR DEVOURER consumes the light. You take ${ctx.fmt(d)} damage.`);await ctx.wait(700);v.remove();
      if(ctx.playerHP<=0)ctx.lose();
    },

    async cosmicRain(ctx){
      const a=ctx.boss.attacks.cosmicRain;ctx.setMessage("COSMIC RAIN // THE SKY IS FALLING.");
      for(let i=1;i<=a.hits;i++){
        if(ctx.playerHP<=0)return;
        const star=document.createElement("div");star.className="nebula-star-impact";star.style.setProperty("--star-index",String(i));document.body.appendChild(star);
        const d=Math.min(ctx.playerHP,a.damagePerHit);ctx.damagePlayer(d);ctx.updateHP();ctx.setMessage(`COSMIC RAIN // ${i}/${a.hits}. You take ${ctx.fmt(d)} damage.`);ctx.shake();await ctx.wait(120);star.remove();
      }
      if(ctx.playerHP<=0)ctx.lose();
    },

    async eventHorizon(ctx){
      const d=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.eventHorizon.damage));
      const v=document.createElement("div");v.className="nebula-horizon-vfx";document.body.appendChild(v);
      ctx.setMessage("EVENT HORIZON.");await ctx.wait(700);ctx.showFlash();ctx.shake();ctx.damagePlayer(d);ctx.updateHP();ctx.setMessage(`EVENT HORIZON swallows your defenses. You take ${ctx.fmt(d)} damage.`);await ctx.wait(700);v.remove();
      if(ctx.playerHP<=0)ctx.lose();
    },

    async cardDraw(ctx){
      if(ctx.state.cardBusy)return;
      ctx.state.cardBusy=true;ctx.setMessage("NEBULA // VOID CARD DRAW. PICK YOUR FATE.");
      const success=await this.cardGame(ctx);
      if(success){
        ctx.applyBossDamage(ctx.boss.attacks.cardDraw.successDamage);
        ctx.updateHP();
        if (ctx.bossHP <= 0) { ctx.completeVictory(ctx.boss.reward, ctx.boss.name); ctx.state.cardBusy=false; return; }
        ctx.setStatus("VOID CARD BROKEN // NEBULA STUNNED");
        ctx.setMessage(`THE CORRECT CARD WOUNDS NEBULA FOR ${ctx.fmt(ctx.boss.attacks.cardDraw.successDamage)} DAMAGE. SHE LOSES HER TURN.`);
        ctx.showFlash();ctx.shake();await ctx.wait(750);
      }else{
        const d=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.cardDraw.failDamage));
        ctx.damagePlayer(d);ctx.updateHP();ctx.state.nextReflectBoost=1.5;
        ctx.setMessage(`WRONG CARD. THE GALAXY OPENS UNDER YOU. You take ${ctx.fmt(d)} damage.`);ctx.showFlash();ctx.shake();await ctx.wait(750);
        if(ctx.playerHP<=0)ctx.lose();
      }
      ctx.state.cardBusy=false;
    },

    cardGame(ctx){
      return new Promise(resolve=>{
        const wrap=document.createElement("div");wrap.className="nebula-card-game";
        const safe=Math.floor(Math.random()*3);
        wrap.innerHTML=`<div class="nebula-card-box"><div class="section-kicker">NEBULA // VOID CARD DRAW</div><h2>CHOOSE ONE.</h2><p>Five seconds. One card survives the collapse.</p><div class="nebula-cards">${[0,1,2].map(i=>`<button class="nebula-choice" data-index="${i}"><span>✦</span><small>CARD ${i+1}</small></button>`).join("")}</div><div class="nebula-card-timer">5</div></div>`;
        document.body.appendChild(wrap);
        const timer=wrap.querySelector(".nebula-card-timer");let done=false;let end=Date.now()+ctx.boss.attacks.cardDraw.timeLimit;
        const interval=setInterval(()=>{const left=Math.max(0,end-Date.now());timer.textContent=(left/1000).toFixed(1);if(left<=0)finish(false);},50);
        function finish(ok){if(done)return;done=true;clearInterval(interval);wrap.remove();resolve(ok);}
        wrap.querySelectorAll(".nebula-choice").forEach(btn=>btn.onclick=()=>finish(Number(btn.dataset.index)===safe));
      });
    }
  }
};
