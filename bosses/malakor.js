/*
==========================================================
 YEN! // MALAKOR
==========================================================
MALAKOR IS FULLY SELF-CONTAINED.
Armor reflection, Bull Rush, Sword Slash, Devil Eye and
all Malakor-only effects live here. Future bosses get their
own file instead of borrowing Malakor's state.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.malakor = {
  id: "malakor",
  name: "MALAKOR",
  stars: 300,
  title: "THE ARMORED DEVIL",
  battleTitle: "THE ARMOR HAS AWAKENED",
  maxHP: 3500000,
  playerMaxHP: 600000,
  reward: 100000000,

  // Replace these two files with your custom Malakor art when ready.
  cardImage: "assets/malakor.png",
  idle: "assets/malakor.png",
  fight: "assets/malakor.png",
  music: "assets/malakor-theme.mp3",
  battleBackground: "assets/malakor-background.png",

  armorReflectionChance: 0.35,
  armorReflectionMultiplier: 0.70,

  attacks: {
    bullRush: {
      name: "BULL RUSH",
      damage: 90000
    },
    swordSlash: {
      name: "SWORD SLASH",
      hits: 6,
      damagePerHit: 10000
    },
    devilEye: {
      name: "DEVIL EYE",
      failDamage: [70000, 95000]
    }
  },

  playerAttacks: [
    ["VOID SLASH",9000,21000,["Your void slash strikes Malakor's armor.","The blade scrapes across his plating."]],
    ["RUNE BURST",7000,26000,["Runes detonate against Malakor.","The armor rings from the impact."]],
    ["SOUL PIERCE",11000,19000,["Your strike searches for a gap in the armor.","You find one for a split second."]],
    ["ECHO BOLT",6000,28000,["Echo energy crashes into the armor.","Blue sparks scatter from Malakor."]],
    ["TOME SHARD",8000,24000,["A Tome shard punches into the plating.","Ancient lettering burns across his armor."]],
    ["STARFALL",10000,22000,["A star crashes onto Malakor.","The impact makes his armor scream."]],
    ["DREAD WAVE",5000,30000,["A dread wave rolls over Malakor.","The armored devil refuses to move."]],
    ["LAST WORD",12000,20000,["Your final word slams into the armor.","The arena cracks beneath the impact."]]
  ],

  intro: [
    "You think armor makes me slow?",
    "Go ahead.",
    "Try to break it."
  ],

  hooks: {
    createState() {
      return { devilEyeBusy:false, reflected:false };
    },

    async afterPlayerHit(ctx) {
      if (ctx.bossHP <= 0 || ctx.state.reflected) return;
      ctx.setMessage(`${ctx.boss.name} took damage. His armor groans under the impact.`);
      await ctx.wait(280);

      if (Math.random() >= ctx.boss.armorReflectionChance) return;

      ctx.state.reflected = true;
      const sourceDamage = ctx.lastPlayerDamage || 0;
      const reflectedDamage = Math.min(
        ctx.playerHP,
        Math.max(1, Math.round(sourceDamage * ctx.boss.armorReflectionMultiplier))
      );

      const armor = document.createElement("div");
      armor.className = "malakor-reflect-vfx";
      armor.textContent = "ARMOR REFLECT";
      document.body.appendChild(armor);
      ctx.showFlash();
      ctx.shake();
      ctx.setMessage(`MALAKOR'S ARMOR REFLECTS THE ATTACK. You take ${ctx.fmt(reflectedDamage)} damage.`);
      ctx.damagePlayer(reflectedDamage);
      ctx.updateHP();
      await ctx.wait(650);
      armor.remove();
      ctx.state.reflected = false;
      if (ctx.playerHP <= 0) ctx.lose();
    },

    async bossTurn(ctx) {
      if (ctx.playerHP <= 0 || ctx.bossHP <= 0) return;
      const roll = Math.random();

      if (roll < 0.34) {
        await this.bullRush(ctx);
        return;
      }

      if (roll < 0.69) {
        await this.swordSlash(ctx);
        return;
      }

      await this.devilEye(ctx);
    },

    async bullRush(ctx) {
      ctx.setMessage("MALAKOR LOWERS HIS HEAD. BULL RUSH.");
      const rush = document.createElement("div");
      rush.className = "malakor-rush-vfx";
      document.body.appendChild(rush);
      ctx.shake();
      await ctx.wait(350);
      rush.classList.add("impact");
      ctx.showFlash();
      const damage = Math.min(ctx.playerHP, ctx.boss.attacks.bullRush.damage);
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`BULL RUSH connects. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(520);
      rush.remove();
      if (ctx.playerHP <= 0) ctx.lose();
    },

    async swordSlash(ctx) {
      ctx.setMessage("MALAKOR DRAWS HIS SWORD. SWORD SLASH.");
      for (let i=1;i<=ctx.boss.attacks.swordSlash.hits;i++) {
        if (ctx.playerHP <= 0) return;
        const slash = document.createElement("div");
        slash.className = "malakor-sword-slash";
        slash.style.setProperty("--slash-index", String(i));
        document.body.appendChild(slash);
        ctx.shake();
        const damage = Math.min(ctx.playerHP, ctx.boss.attacks.swordSlash.damagePerHit);
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.setMessage(`SWORD SLASH // ${i}/6. You take ${ctx.fmt(damage)} damage.`);
        await ctx.wait(180);
        slash.remove();
      }
      if (ctx.playerHP <= 0) ctx.lose();
    },

    async devilEye(ctx) {
      if (ctx.state.devilEyeBusy) return;
      ctx.state.devilEyeBusy = true;
      ctx.setMessage("MALAKOR OPENS HIS DEVIL EYE.");
      await ctx.wait(350);
      const success = await this.devilEyeGame(ctx);

      if (success) {
        ctx.state.stunned = true;
        ctx.setStatus("STUNNED // ONE FREE TURN");
        ctx.setMessage("YOU BREAK THE DEVIL EYE. MALAKOR IS STUNNED FOR ONE TURN.");
        ctx.showFlash();
        ctx.shake();
        await ctx.wait(800);
      } else {
        const damage = Math.min(ctx.playerHP, ctx.randomInt(ctx.boss.attacks.devilEye.failDamage[0],ctx.boss.attacks.devilEye.failDamage[1]));
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.setMessage(`DEVIL EYE FAILED. Malakor tears through you for ${ctx.fmt(damage)} damage.`);
        ctx.shake();
        await ctx.wait(800);
        if (ctx.playerHP <= 0) ctx.lose();
      }
      ctx.state.devilEyeBusy = false;
    },

    devilEyeGame(ctx) {
      return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "malakor-mini-game";
        wrap.innerHTML = `<div class="malakor-mini-card">
          <div class="section-kicker">MALAKOR // DEVIL EYE</div>
          <h2>BREAK HIS GAZE</h2>
          <p>Hit the button while the marker is inside the core. Win and Malakor is stunned. Miss and take massive damage.</p>
          <div class="malakor-eye-track"><div class="malakor-eye-core"></div><div class="malakor-eye-cursor"></div></div>
          <button class="malakor-eye-button">BREAK THE EYE</button>
        </div>`;
        document.body.appendChild(wrap);
        const cursor=wrap.querySelector(".malakor-eye-cursor");
        const button=wrap.querySelector(".malakor-eye-button");
        const started=performance.now();
        let raf=0,done=false;
        const finish=success=>{if(done)return;done=true;cancelAnimationFrame(raf);wrap.remove();resolve(success);};
        const animate=now=>{
          const x=Math.min(100,((now-started)/1250)*100);
          cursor.style.left=`${x}%`;
          if(x>=100) finish(false); else raf=requestAnimationFrame(animate);
        };
        button.onclick=()=>{
          const x=parseFloat(cursor.style.left||"0");
          finish(x>=43&&x<=57);
        };
        raf=requestAnimationFrame(animate);
      });
    }
  }
};
