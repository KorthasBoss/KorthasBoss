/*
==========================================================
 YEN! // AETHELGARD
==========================================================
Aethelgard is completely self-contained.
His name-entry encounter, two phases, attack denial,
Death Moon, Eyes Are Falling and Star Effect all live here.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};

window.YEN_BOSSES.aethelgard = {
  id: "aethelgard",
  name: "AETHELGARD",
  stars: 1000,
  title: "THE TRUE FINAL LORD",
  battleTitle: "THE LORD OF THIS WORLD",
  maxHP: 20000000,
  playerMaxHP: 600000,
  reward: 1000000000,

  // The supplied frame is used ONLY for this boss's special lobby card.
  cardImage: "assets/aethelgard-card-frame.png",
  cardFrame: "assets/aethelgard-card-frame.png",
  idle: "assets/Aethelgard.png",
  fight: "assets/Aethelgard.png",
  music: "assets/oceans.mp3",
  battleBackground: "assets/Background.gif",

  attackNullChance: 0.38,
  phaseTwoNullChance: 0.55,
  damagePerSuccessfulAttack: 3000,
  phaseTwoAtHP: 10000000,

  deathMoon: {
    name: "DEATH MOON",
    failDamage: [65000, 100000]
  },
  eyesFalling: {
    name: "EYES ARE FALLING",
    correctDamage: 20000,
    failDamage: [50000, 85000],
    timeLimit: 5000
  },
  starEffect: {
    name: "STAR EFFECT",
    chance: 0.18,
    cooldown: 4000
  },

  phaseOneAttacks: [
    {name:"DEATH MOON"},
    {name:"EYES ARE FALLING"},
    {name:"STAR EFFECT"}
  ],

  phaseTwoAttacks: [
    {name:"CELESTIAL EXECUTION", min:65000, max:95000},
    {name:"LORD'S GRAVITY", min:48000, max:88000},
    {name:"WHITE ABYSS", min:55000, max:100000},
    {name:"CROWN OF THE END", min:70000, max:120000},
    {name:"HEAVEN'S SHATTER", min:60000, max:105000},
    {name:"FINAL DECREE", min:80000, max:135000},
    {name:"FALLEN CONSTELLATION", min:45000, max:110000},
    {name:"ETERNAL NIGHT", min:90000, max:145000}
  ],

  intro: [],

  hooks: {
    createState() {
      return {
        introLocked: false,
        playerName: "Visitor",
        phaseTwo: false,
        starEffectBusy: false,
        deathMoonBusy: false,
        eyesBusy: false
      };
    },

    async onStart(ctx) {
      ctx.state.introLocked = true;
      ctx.buildAttackButtons();
      ctx.bossAttackEnabled(false);

      ctx.setMessage("Oh, Another visitor.");
      await ctx.wait(950);
      ctx.setMessage("I haven't seen any for 8 Years.");
      await ctx.wait(950);
      ctx.setMessage("Tell me.");
      await ctx.wait(700);

      const name = await this.askName(ctx);
      ctx.state.playerName = name || "Visitor";

      ctx.setMessage(`Ahh. ${ctx.state.playerName}.`);
      await ctx.wait(950);
      ctx.setMessage("Well it's nice to meet you, I'm Aethelgard The true final Lord of those world you see right now.");
      await ctx.wait(1450);
      ctx.setMessage("Now thats out the way.");
      await ctx.wait(800);
      ctx.setMessage(`You Must die ${ctx.state.playerName}.`);
      await ctx.wait(900);
      ctx.setMessage("Nice knowing ya.");
      await ctx.wait(800);

      const white = document.createElement("div");
      white.className = "aethelgard-white-fade";
      document.body.appendChild(white);
      await ctx.wait(900);
      white.remove();

      ctx.state.introLocked = false;
      ctx.buildAttackButtons();
      ctx.setPhase("PHASE ONE // AETHELGARD");
      ctx.setStatus("THE TRUE FINAL LORD AWAKENED");
    },

    askName(ctx) {
      return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "aethelgard-name-overlay";
        wrap.innerHTML = `<div class="aethelgard-name-box">
          <div class="section-kicker">AETHELGARD // IDENTIFICATION</div>
          <h2>WHAT'S YOUR NAME?</h2>
          <p>Aethelgard is waiting for your answer.</p>
          <input class="aethelgard-name-input" maxlength="24" autocomplete="off" placeholder="TYPE YOUR NAME...">
          <button class="menu-button primary aethelgard-name-submit">CONTINUE <span>↗</span></button>
        </div>`;
        document.body.appendChild(wrap);
        const input = wrap.querySelector(".aethelgard-name-input");
        const submit = wrap.querySelector(".aethelgard-name-submit");
        const finish = () => {
          const value = input.value.trim();
          if (!value) { input.focus(); return; }
          wrap.remove();
          resolve(value);
        };
        submit.onclick = finish;
        input.addEventListener("keydown", e => { if (e.key === "Enter") finish(); });
        setTimeout(() => input.focus(), 50);
      });
    },

    async beforePlayerAttack(ctx, attack) {
      if (ctx.state.introLocked) return true;

      const chance = ctx.state.phaseTwo ? ctx.boss.phaseTwoNullChance : ctx.boss.attackNullChance;
      if (Math.random() < chance) {
        ctx.setMessage(`AETHELGARD ignores ${attack.name}. Your attack has no effect.`);
        ctx.addMessageClass("aethelgard-null");
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(600);
        ctx.removeMessageClass("aethelgard-null");
        await this.bossTurn(ctx);
        return true;
      }

      // Aethelgard's armor makes every successful player attack deal exactly 3,000.
      attack._aethelgardFixedDamage = ctx.boss.damagePerSuccessfulAttack;
      return false;
    },

    async afterPlayerHit(ctx) {
      if (!ctx.state.phaseTwo && ctx.bossHP <= ctx.boss.phaseTwoAtHP && ctx.bossHP > 0) {
        await this.enterPhaseTwo(ctx);
      }
    },

    async enterPhaseTwo(ctx) {
      ctx.state.phaseTwo = true;
      ctx.setPhase("PHASE TWO // SERIOUSLY NOW");
      ctx.setStatus("LIMITERS DESTROYED // 8 SKILLS UNLOCKED");
      ctx.setMessage("Wow..");
      await ctx.wait(900);
      ctx.setMessage("In my years, days of living here no one as ever made me bleed before.");
      await ctx.wait(1250);
      ctx.setMessage("Its time to play serious.");
      await ctx.wait(950);

      const white = document.createElement("div");
      white.className = "aethelgard-white-fade phase-change";
      document.body.appendChild(white);
      await ctx.wait(1000);
      white.remove();

      ctx.setStatus("PHASE TWO // UNPREDICTABLE");
      ctx.setPhase("PHASE TWO // THE FINAL LORD");
      ctx.setMessage("Eight new skills have been unlocked. Aethelgard has stopped holding back.");
      ctx.showFlash();
      await ctx.wait(800);
    },

    async bossTurn(ctx) {
      if (ctx.playerHP <= 0 || ctx.bossHP <= 0) return;

      if (ctx.state.phaseTwo) {
        // Deliberately unpredictable: phase-two attacks are selected independently.
        const move = ctx.pick(ctx.boss.phaseTwoAttacks);
        const damage = Math.min(ctx.playerHP, ctx.randomInt(move.min, move.max));
        ctx.setMessage(`AETHELGARD // ${move.name}`);
        await ctx.wait(180);
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.shake();
        ctx.showFlash();
        ctx.setMessage(`${move.name} tears through you. You take ${ctx.fmt(damage)} damage.`);
        await ctx.wait(520);
        if (ctx.playerHP <= 0) ctx.lose();
        return;
      }

      const roll = Math.random();
      if (roll < ctx.boss.starEffect.chance) {
        await this.starEffect(ctx);
        return;
      }
      if (Math.random() < 0.52) {
        await this.deathMoonGame(ctx);
        return;
      }
      await this.eyesAreFalling(ctx);
    },

    async deathMoonGame(ctx) {
      if (ctx.state.deathMoonBusy) return;
      ctx.state.deathMoonBusy = true;
      ctx.setMessage("DEATH MOON. Don't blink.");
      await ctx.wait(300);
      const success = await this.deathMoonMiniGame(ctx);
      if (success) {
        ctx.setStatus("DEATH MOON BROKEN // BOSS STUNNED");
        ctx.setMessage("You beat Death Moon. Aethelgard loses his turn.");
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(750);
      } else {
        const damage = Math.min(ctx.playerHP, ctx.randomInt(ctx.boss.deathMoon.failDamage[0], ctx.boss.deathMoon.failDamage[1]));
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.setMessage(`DEATH MOON FAILED. You take ${ctx.fmt(damage)} damage.`);
        ctx.shake();
        await ctx.wait(750);
        if (ctx.playerHP <= 0) ctx.lose();
      }
      ctx.state.deathMoonBusy = false;
    },

    deathMoonMiniGame(ctx) {
      return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "aethelgard-mini-game death-moon-game";
        wrap.innerHTML = `<div class="aethelgard-mini-card">
          <div class="section-kicker">AETHELGARD // DEATH MOON</div>
          <h2>BREAK THE MOON</h2>
          <p>Move the core into the moon's light before the circle closes.</p>
          <div class="aethelgard-moon-track"><div class="aethelgard-moon-target"></div><div class="aethelgard-moon-cursor"></div></div>
          <button class="menu-button primary aethelgard-mini-button">BREAK DEATH MOON</button>
        </div>`;
        document.body.appendChild(wrap);
        const cursor=wrap.querySelector(".aethelgard-moon-cursor");
        const button=wrap.querySelector(".aethelgard-mini-button");
        const started=performance.now();
        let raf=0,done=false;
        const finish=success=>{if(done)return;done=true;cancelAnimationFrame(raf);wrap.remove();resolve(success);};
        const animate=now=>{const x=Math.min(100,((now-started)/1500)*100);cursor.style.left=`${x}%`;if(x>=100)finish(false);else raf=requestAnimationFrame(animate);};
        button.onclick=()=>{const x=parseFloat(cursor.style.left||"0");finish(x>=42&&x<=58);};
        raf=requestAnimationFrame(animate);
      });
    },

    async eyesAreFalling(ctx) {
      if (ctx.state.eyesBusy) return;
      ctx.state.eyesBusy = true;
      ctx.setMessage("EYES ARE FALLING. Choose before the sky closes.");
      const success = await this.eyeCardGame(ctx);
      if (success) {
        const damage = Math.min(ctx.bossHP, ctx.boss.eyesFalling.correctDamage);
        ctx.bossHP = Math.max(0, ctx.bossHP - damage);
        ctx.updateHP();
        ctx.setMessage(`RIGHT CARD. Aethelgard takes ${ctx.fmt(damage)} damage.`);
        ctx.showFlash();
        await ctx.wait(700);
        if (ctx.bossHP <= 0) await ctx.completeVictory(ctx.boss.reward, ctx.boss.name);
      } else {
        const damage = Math.min(ctx.playerHP, ctx.randomInt(ctx.boss.eyesFalling.failDamage[0], ctx.boss.eyesFalling.failDamage[1]));
        ctx.damagePlayer(damage);
        ctx.updateHP();
        const slash = document.createElement("div");
        slash.className = "aethelgard-galaxy-slash";
        document.body.appendChild(slash);
        ctx.showFlash();
        ctx.shake();
        ctx.setMessage(`WRONG CARD. A galaxy slash cuts through you for ${ctx.fmt(damage)} damage.`);
        await ctx.wait(800);
        slash.remove();
        if (ctx.playerHP <= 0) ctx.lose();
      }
      ctx.state.eyesBusy = false;
    },

    eyeCardGame(ctx) {
      return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "aethelgard-card-game";
        const correct = Math.floor(Math.random()*3);
        wrap.innerHTML = `<div class="aethelgard-card-box"><div class="section-kicker">EYES ARE FALLING</div><h2>CHOOSE A CARD</h2><p>You have <strong>5 seconds.</strong> One card is safe.</p><div class="aethelgard-cards">${[0,1,2].map(i=>`<button class="aethelgard-choice-card" data-index="${i}"><span>?</span><small>CARD ${i+1}</small></button>`).join("")}</div><div class="aethelgard-countdown">5</div></div>`;
        document.body.appendChild(wrap);
        let done=false;
        let left=5;
        const timer=setInterval(()=>{left-=1;const el=wrap.querySelector(".aethelgard-countdown");if(el)el.textContent=String(Math.max(0,left));if(left<=0)finish(false);},1000);
        const finish=success=>{if(done)return;done=true;clearInterval(timer);wrap.remove();resolve(success);};
        wrap.querySelectorAll(".aethelgard-choice-card").forEach(card=>card.onclick=()=>finish(Number(card.dataset.index)===correct));
      });
    },

    async starEffect(ctx) {
      if (ctx.state.starEffectBusy) return;
      ctx.state.starEffectBusy = true;
      const stars=[];
      for(let i=0;i<34;i++){
        const star=document.createElement("div");
        star.className="aethelgard-rain-star";
        star.textContent="★";
        star.style.left=`${Math.random()*100}vw`;
        star.style.animationDelay=`${Math.random()*350}ms`;
        document.body.appendChild(star);
        stars.push(star);
      }
      ctx.setMessage("STAR EFFECT. White stars rain across your screen.");
      await ctx.wait(850);
      stars.forEach(x=>x.remove());

      const buttons=ctx.getPlayerAttackButtons();
      if(buttons.length){
        const target=ctx.pick(buttons);
        const attackKey=ctx.getAttackKey(target);
        ctx.cooldownAttack({key:attackKey},ctx.boss.starEffect.cooldown);
        target.classList.add("star-cursed");
        ctx.setMessage(`${target.textContent} is marked by STAR EFFECT. It cannot be used for 4 seconds.`);
        setTimeout(()=>target.classList.remove("star-cursed"),ctx.boss.starEffect.cooldown);
      } else {
        ctx.setMessage("STAR EFFECT finds no usable skill to curse.");
      }
      await ctx.wait(650);
      ctx.state.starEffectBusy = false;
    }
  }
};
