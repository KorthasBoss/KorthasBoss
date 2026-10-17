/*
==========================================================
 YEN! // AMIAS
==========================================================
AMIAS IS FULLY SELF-CONTAINED.
She is a high-threat duelist with parries, bleed, brutal
multi-hit attacks and a dedicated combat VFX set.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.amias = {
  id: "amias",
  name: "AMIAS",
  stars: 50000000,
  title: "THE BLOODBOUND SOVEREIGN",
  battleTitle: "THE WOMAN WHO NEVER MISSES",
  maxHP: 35000000,
  playerMaxHP: 1200000,
  reward: 5000000000,

  // Replace these with your final Amias art/background whenever ready.
  cardImage: "assets/Amias.png",
  profileFrame: "assets/Amias _Card.png",
  idle: "assets/Amias.png",
  fight: "assets/Amias.png",
  music: "assets/oceans.mp3",
  battleBackground: "assets/royal.jpg",
  parryChance: 0.34,

  playerAttacks: [
    ["VOID SLASH",9000,21000,["Your void slash cuts through Amias's aura.","A dark arc tears across the arena."]],
    ["RUNE BURST",7000,26000,["Runes detonate around Amias.","The burst forces her backward."]],
    ["SOUL PIERCE",11000,19000,["Your strike searches for her heart.","Steel meets bloodbound power."]],
    ["ECHO BOLT",6000,28000,["Echo energy snaps into Amias.","The impact rings through the arena."]],
    ["TOME SHARD",8000,24000,["A Tome shard slices through her guard.","Ancient lettering flashes over her armor."]],
    ["STARFALL",10000,22000,["A star crashes onto Amias.","The arena erupts with white sparks."]],
    ["DREAD WAVE",5000,30000,["A dread wave slams into her.","Amias refuses to yield."]],
    ["LAST WORD",12000,20000,["Your final word strikes with brutal force.","The air fractures around her."]]
  ],

  attacks: {
    slash: { name:"SLASH", damage:90000, bleedDamage:20, bleedSeconds:10 },
    ribStab: { name:"RIB EXECUTION", damage:185000 },
    crimsonWaltz: { name:"CRIMSON WALTZ", hits:7, damagePerHit:26000 },
    bloodCrown: { name:"BLOOD CROWN", damage:[120000,185000] },
    heartseeker: { name:"HEARTSEEKER", damage:[150000,230000] },
    redJudgment: { name:"RED JUDGMENT", damage:[90000,280000] }
  },

  intro: ["You walked all this way.","Then bleed for it."] ,

  hooks: {
    createState() {
      return { bleeding:false, bleedTimer:null, parried:false };
    },

    cleanup(ctx) {
      if (ctx.state.bleedTimer) clearInterval(ctx.state.bleedTimer);
      ctx.state.bleedTimer = null;
    },

    async beforePlayerAttack(ctx, attack) {
      if (Math.random() >= ctx.boss.parryChance) return false;
      ctx.state.parried = true;
      const name = attack.name || attack[0];
      ctx.setMessage(`AMIAS PARRIES ${name}.`);
      ctx.addMessageClass("amias-parry-text");
      await this.parryVfx(ctx);
      const damage = Math.min(ctx.playerHP, ctx.boss.attacks.ribStab.damage);
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`RIB EXECUTION. Amias drives a massive blade into your ribs. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(700);
      ctx.removeMessageClass("amias-parry-text");
      ctx.state.parried = false;
      if (ctx.playerHP <= 0) ctx.lose();
      return true;
    },

    async bossTurn(ctx) {
      const roll = Math.random();
      if (roll < 0.27) { await this.slash(ctx); return; }
      if (roll < 0.47) { await this.crimsonWaltz(ctx); return; }
      if (roll < 0.66) { await this.bloodCrown(ctx); return; }
      if (roll < 0.84) { await this.heartseeker(ctx); return; }
      await this.redJudgment(ctx);
    },

    async slash(ctx) {
      const a = ctx.boss.attacks.slash;
      ctx.setMessage("AMIAS // SLASH");
      await this.slashVfx(ctx);
      const damage = Math.min(ctx.playerHP, a.damage);
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`SLASH tears open a deep wound. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(260);
      if (ctx.playerHP <= 0) { ctx.lose(); return; }

      ctx.setMessage("INTERNAL BLEEDING // 20 HP PER SECOND // 10 SECONDS");
      if (ctx.state.bleedTimer) clearInterval(ctx.state.bleedTimer);
      let ticks = a.bleedSeconds;
      ctx.state.bleeding = true;
      ctx.state.bleedTimer = setInterval(() => {
        if (ctx.playerHP <= 0 || ticks <= 0) {
          clearInterval(ctx.state.bleedTimer);
          ctx.state.bleedTimer = null;
          ctx.state.bleeding = false;
          return;
        }
        ctx.damagePlayer(a.bleedDamage);
        ctx.updateHP();
        ticks--;
        if (ticks <= 0) {
          clearInterval(ctx.state.bleedTimer);
          ctx.state.bleedTimer = null;
          ctx.state.bleeding = false;
          ctx.setMessage("AMIAS'S INTERNAL BLEEDING ENDS.");
        }
        if (ctx.playerHP <= 0) ctx.lose();
      },1000);
      await ctx.wait(500);
    },

    async crimsonWaltz(ctx) {
      const a=ctx.boss.attacks.crimsonWaltz;
      ctx.setMessage("AMIAS // CRIMSON WALTZ");
      for(let i=1;i<=a.hits;i++){
        if(ctx.playerHP<=0) return;
        const slash=document.createElement("div");
        slash.className="amias-crimson-slash";
        slash.style.setProperty("--slash-index",String(i));
        document.body.appendChild(slash);
        ctx.showFlash(); ctx.shake();
        const damage=Math.min(ctx.playerHP,a.damagePerHit);
        ctx.damagePlayer(damage); ctx.updateHP();
        ctx.setMessage(`CRIMSON WALTZ // ${i}/${a.hits}. You take ${ctx.fmt(damage)} damage.`);
        await ctx.wait(105);
        slash.remove();
      }
      if(ctx.playerHP<=0) ctx.lose();
    },

    async bloodCrown(ctx) {
      const damage=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.bloodCrown.damage));
      ctx.setMessage("AMIAS SUMMONS THE BLOOD CROWN.");
      const v=document.createElement("div"); v.className="amias-blood-crown"; document.body.appendChild(v);
      await ctx.wait(450); ctx.showFlash(); ctx.shake();
      ctx.damagePlayer(damage); ctx.updateHP();
      ctx.setMessage(`BLOOD CROWN ERUPTS. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(650); v.remove();
      if(ctx.playerHP<=0) ctx.lose();
    },

    async heartseeker(ctx) {
      const damage=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.heartseeker.damage));
      ctx.setMessage("AMIAS LOCKS ONTO YOUR HEART.");
      const v=document.createElement("div"); v.className="amias-heartseeker"; document.body.appendChild(v);
      await ctx.wait(550); ctx.showFlash(); ctx.shake();
      ctx.damagePlayer(damage); ctx.updateHP();
      ctx.setMessage(`HEARTSEEKER CONNECTS. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(650); v.remove();
      if(ctx.playerHP<=0) ctx.lose();
    },

    async redJudgment(ctx) {
      const damage=Math.min(ctx.playerHP,ctx.randomInt(...ctx.boss.attacks.redJudgment.damage));
      ctx.setMessage("AMIAS // RED JUDGMENT");
      const v=document.createElement("div"); v.className="amias-red-judgment"; document.body.appendChild(v);
      await ctx.wait(350); ctx.showFlash(); ctx.shake();
      ctx.damagePlayer(damage); ctx.updateHP();
      ctx.setMessage(`RED JUDGMENT crushes the arena. You take ${ctx.fmt(damage)} damage.`);
      await ctx.wait(700); v.remove();
      if(ctx.playerHP<=0) ctx.lose();
    },

    async parryVfx(ctx) {
      const burst=document.createElement("div"); burst.className="amias-parry-vfx"; document.body.appendChild(burst);
      ctx.showFlash(); ctx.shake(); await ctx.wait(360); burst.remove();
    },

    async slashVfx(ctx) {
      const v=document.createElement("div"); v.className="amias-slash-vfx"; document.body.appendChild(v);
      ctx.showFlash(); ctx.shake(); await ctx.wait(420); v.remove();
    }
  }
};
