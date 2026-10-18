/*
==========================================================
 YEN! // AZAEL
==========================================================
Azael is fully self-contained. No Korthas phase state is used here.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.azael = {
  id: "azael",
  name: "AZAEL",
  stars: 150,
  title: "THE DOMAIN-BEARER",
  maxHP: 2300000,
  playerMaxHP: 180000,
  reward: 25000000,
  cardImage: "assets/Azael.png",
  idle: "assets/Azael.png",
  fight: "assets/Azael.png",
  music: "assets/korthas-theme.mp3",
  battleBackground: "assets/Azaelbck.png",
  domainBackground: "assets/domain-background.svg",

  miniGameAttack: {
    name: "JUDGMENT GAME",
    failDamage: [65000,90000],
    successText: "You break Azael's judgment. AZAEL IS STUNNED FOR ONE TURN."
  },
  tearsAttack: {
    name: "TEARS",
    damage: [48000,78000],
    messages: [
      "Azael's tears hit the arena like acid.",
      "The tears burn through your soul.",
      "You feel the damage long after the impact."
    ]
  },
  domainAttack: { name:"DOMAIN", chance:0.10 },
  domainDuration: 240000,

  domainAttacks: [
    {name:"RED HORIZON",min:30000,max:52000},
    {name:"ABYSSAL DECREE",min:36000,max:60000},
    {name:"CRIMSON FALL",min:28000,max:68000},
    {name:"DOMAIN BREAKER",min:42000,max:72000},
    {name:"AZAEL'S FINAL WORD",min:50000,max:85000}
  ],

  intro: ["....","So you finally found me.","Do not mistake my silence for mercy."],
  domainStart: ["AZAEL opens their domain.","The world around you goes completely black.","Something has changed."],
  domainEnd: "The domain collapses. The world returns to normal.",

  // Azael does not inherit another boss's attack list.
  playerAttacks: [
     ["SLASH",9000,21000,["Your void slash reaches Aethelgard.","The hit sparks against his armor."]],
    ["LAST WORD",12000,20000,["Your final word strikes the True Final Lord.","The air fractures around Aethelgard."]]
  ],

  hooks: {
    createState() {
      return { domainActive:false, domainEndsAt:0, domainTimer:null, stunned:false };
    },

    cleanup(ctx) {
      if (ctx.state.domainTimer) clearInterval(ctx.state.domainTimer);
      ctx.state.domainTimer = null;
      ctx.state.domainActive = false;
      ctx.state.domainEndsAt = 0;
      document.body.classList.remove("azael-domain");
      document.querySelector(".domain-timer")?.remove();
    },

    async bossTurn(ctx) {
      if (ctx.state.domainActive) {
        const move = ctx.pick(ctx.boss.domainAttacks);
        const damage = Math.min(ctx.playerHP,ctx.randomInt(move.min,move.max));
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.setMessage(`${move.name} tears through the domain. You take ${ctx.fmt(damage)} damage.`);
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(750);
        if (ctx.playerHP <= 0) ctx.lose();
        return;
      }

      // Domain has exactly a 10% chance whenever Azael gets a normal turn.
      if (Math.random() < ctx.boss.domainAttack.chance) {
        await this.activateDomain(ctx);
        return;
      }

      if (Math.random() < 0.5) {
        await this.runJudgment(ctx);
        return;
      }

      const move = ctx.boss.tearsAttack;
      const damage = Math.min(ctx.playerHP,ctx.randomInt(move.damage[0],move.damage[1]));
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`${ctx.pick(move.messages)} You take ${ctx.fmt(damage)} damage.`);
      ctx.shake();
      await ctx.wait(850);
      if (ctx.playerHP <= 0) ctx.lose();
    },

    async runJudgment(ctx) {
      ctx.setMessage("AZAEL forces you into a judgment game.");
      await ctx.wait(450);
      const success = await this.miniGame(ctx);
      if (success) {
        ctx.state.stunned = true;
        ctx.setStatus("STUNNED // ONE FREE TURN");
        ctx.setMessage(ctx.boss.miniGameAttack.successText);
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(850);
        return;
      }

      const damage = Math.min(ctx.playerHP,ctx.randomInt(ctx.boss.miniGameAttack.failDamage[0],ctx.boss.miniGameAttack.failDamage[1]));
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`JUDGMENT FAILED. Azael crushes you for ${ctx.fmt(damage)} damage.`);
      ctx.shake();
      await ctx.wait(850);
      if (ctx.playerHP <= 0) ctx.lose();
    },

    miniGame(ctx) {
      return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "domain-mini-game";
        wrap.innerHTML = `<div class="domain-mini-card">
          <div class="section-kicker">AZAEL // JUDGMENT GAME</div>
          <h2>BREAK THE JUDGMENT</h2>
          <p>Strike while the marker is inside the red target. Fail and Azael tears through your soul.</p>
          <div class="domain-reaction"><div class="domain-reaction-target"></div><div class="domain-reaction-cursor"></div></div>
          <button class="domain-hit-button">STRIKE THE CORE</button>
        </div>`;
        document.body.appendChild(wrap);
        const cursor = wrap.querySelector(".domain-reaction-cursor");
        const button = wrap.querySelector(".domain-hit-button");
        const started = performance.now();
        let raf = 0, done = false;
        const finish = success => { if(done)return; done=true; cancelAnimationFrame(raf); wrap.remove(); resolve(success); };
        const animate = now => {
          const x = Math.min(100,((now-started)/1450)*100);
          cursor.style.left = `${x}%`;
          if(x>=100) finish(false); else raf=requestAnimationFrame(animate);
        };
        button.onclick = () => {
          const x = parseFloat(cursor.style.left || "0");
          finish(x>=40 && x<=60);
        };
        raf=requestAnimationFrame(animate);
      });
    },

    async activateDomain(ctx) {
      if(ctx.state.domainActive) return;
      ctx.state.domainActive = true;
      ctx.state.domainEndsAt = Date.now() + ctx.boss.domainDuration;
      ctx.setPhase("DOMAIN // FOUR MINUTES");
      ctx.setMessage(ctx.boss.domainStart[0]);
      const black = document.createElement("div");
      black.className = "domain-transition";
      document.body.appendChild(black);
      await ctx.wait(900);
      ctx.setMessage(ctx.boss.domainStart[1]);
      await ctx.wait(450);
      document.body.classList.add("azael-domain");
      ctx.setBackground(ctx.boss.domainBackground);
      ctx.setStatus("DOMAIN ACTIVE // UNPREDICTABLE");
      ctx.setBossAura("empress-aura");

      const timer = document.createElement("div");
      timer.className = "domain-timer";
      document.body.appendChild(timer);

      const tick = () => {
        const left = Math.max(0,ctx.state.domainEndsAt-Date.now());
        const seconds = Math.ceil(left/1000);
        timer.textContent = `DOMAIN // ${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
        if(left<=0) {
          this.cleanup(ctx);
          ctx.setBackground(ctx.boss.battleBackground);
          ctx.setPhase(`PHASE ONE // ${ctx.boss.name}`);
          ctx.setStatus("DOMAIN COLLAPSED // POWER RETURNED");
          ctx.setMessage(ctx.boss.domainEnd);
        }
      };
      ctx.state.domainTimer = setInterval(tick,250);
      tick();
      await ctx.wait(900);
      black.remove();
      ctx.setMessage("THE DOMAIN IS ACTIVE. AZAEL HAS UNLOCKED FIVE MORE SKILLS.");
    }
  }
};
