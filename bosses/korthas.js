/*
==========================================================
 YEN! // KORTHAS
==========================================================
Everything unique to Korthas lives in this file.
Future bosses do NOT use this file's combat rules.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};

window.YEN_BOSSES.korthas = {
  id: "korthas",
  name: "KORTHAS",
  stars: 56,
  title: "THE OATHBOUND",
  maxHP: 700000,
  playerMaxHP: 180000,
  reward: 1500000,

  cardImage: "assets/korthas-idle.png",
  idle: "assets/korthas-idle.png",
  fight: "assets/korthas-fight.png",
  defeat: "assets/korthas-defeat.png",
  stageTwo: "assets/korthas-stage2.png",
  attackImage: "assets/korthas-attack.png",
  music: "assets/korthas-theme.mp3",
  battleBackground: "assets/Background.gif",
  parrySound: "assets/perry.mp3",

  phaseTwoAtHP: 610000,

  playerAttacks: [
    ["VOID SLASH",9000,21000,["Your void slash tears through the dark.","A clean hit. Korthas staggers.","Blue sparks scatter from the impact."]],
    ["RUNE BURST",7000,26000,["Runes detonate around Korthas.","The rune burst hits harder than expected.","A ring of light snaps shut around the boss."]],
    ["SOUL PIERCE",11000,19000,["Your strike pierces his guard.","The hit lands with a sharp crack.","Korthas's aura flickers from the impact."]],
    ["ECHO BOLT",6000,28000,["An echo bolt ricochets into Korthas.","The blast hits twice in quick succession.","Blue energy bursts across the arena."]],
    ["TOME SHARD",8000,24000,["A shard of the Tome cuts through the air.","The shard detonates on impact.","Ancient lettering burns across his armor."]],
    ["STARFALL",10000,22000,["A star falls directly onto Korthas.","The arena flashes as the star connects.","The impact sends a ripple through the floor."]],
    ["DREAD WAVE",5000,30000,["A wave of dread crashes into the boss.","The attack surges with unstable power.","Korthas absorbs the hit with a growl."]],
    ["LAST WORD",12000,20000,["Your final word strikes like a curse.","The attack lands with brutal precision.","The air cracks around Korthas."]]
  ],

  bossAttacks: [
    ["TRIDENT ARC",12000,23000],
    ["TOME SHOCK",8000,28000],
    ["KING'S JUDGMENT",15000,32000]
  ],

  intro: ["....","I see. You think you have what it takes.","Have it you're way, dumb ass."],
  phaseTwo: ["Heh..","I guess this is it..","You fucking.","BASTARD!!!!!!"],
  phaseFinal: "WE'RE FIGHTING FOR REAAALLLL, THIS TIME!",
  defeat: [".....","You... did it..."],

  empress: {
    name: "EMPRESS",
    maxHP: 1000000,
    image: "assets/empress.png",
    title: "THE QUEEN OF THE CASTLE",
    level: "CASTLE // ???",
    parrySound: "assets/perry.mp3",
    parryChance: 0.72,
    lines: [
      "You dare to hurt my husband in my own castle.",
      "I didn't know magnet's can go this low.",
      "Yet",
      "Here you are.",
      "I WILL",
      "MAKE",
      "SURE",
      "YOU WIISH YOU NEVER DONE THIS"
    ]
  },

  hooks: {
    createState() {
      return { phaseTwo:false, empress:false, empressHP:0, finishShown:false };
    },

    async afterPlayerHit(ctx) {
      if (!ctx.state.phaseTwo && ctx.bossHP <= ctx.boss.phaseTwoAtHP && ctx.bossHP > 0) {
        await this.enterPhaseTwo(ctx);
      }
    },

    async enterPhaseTwo(ctx) {
      ctx.state.phaseTwo = true;
      ctx.setPhase("PHASE TWO // NO MORE MERCY");
      ctx.setStatus("LIMITERS DESTROYED");
      ctx.setCharacter(ctx.boss.defeat);

      for (const line of ctx.boss.phaseTwo) {
        ctx.setMessage(line);
        ctx.addMessageClass("angry-text");
        ctx.shake();
        await ctx.wait(line.includes("BASTARD") ? 1100 : 750);
      }

      ctx.removeMessageClass("angry-text");
      ctx.showFlash();
      await ctx.wait(500);
      ctx.setCharacter(ctx.boss.stageTwo);
      ctx.setStatus("AWAKENED // DANGEROUS");
      ctx.setBossNameClass("angry-text");
      ctx.setMessage(ctx.boss.phaseFinal);
      await ctx.wait(1000);
      ctx.clearBossNameClass();
      await this.breakSkills(ctx);
    },

    async breakSkills(ctx) {
      const buttons = [...document.querySelectorAll("#attack-grid .attack-button:not(.potion-button):not(:disabled)")]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (!buttons.length) {
        ctx.setMessage("Korthas reaches for the trident, but there are no skills left to destroy.");
        return;
      }

      for (const button of buttons) {
        const key = ctx.getAttackKey(button);
        if (key == null) continue;
        ctx.setMessage(`Korthas targets ${button.textContent}...`);
        await this.throwTrident(ctx, button);
        button.classList.add("broken");
        ctx.shake();
        await ctx.wait(220);
        ctx.markBroken(key);
        button.remove();
        ctx.updateHP();
      }

      ctx.setMessage("Korthas's TRIDENT ARC has destroyed three of your skills. He is faster now.");
    },

    async throwTrident(ctx, target) {
      const rect = target.getBoundingClientRect();
      const trident = document.createElement("img");
      trident.src = ctx.boss.attackImage;
      trident.className = "spear-projectile";
      trident.style.setProperty("--target-x", `${rect.left + rect.width / 2}px`);
      trident.style.setProperty("--target-y", `${rect.top + rect.height / 2}px`);
      document.body.appendChild(trident);
      await ctx.wait(500);
      trident.remove();
    },

    async bossTurn(ctx) {
      if (ctx.playerHP <= 0 || ctx.bossHP <= 0) return;
      const move = ctx.pick(ctx.boss.bossAttacks);
      let damage = ctx.randomInt(move[1], move[2]);
      if (ctx.state.phaseTwo) damage = Math.round(damage * 1.45);
      ctx.damagePlayer(damage);
      ctx.setMessage(`${move[0]} hits you. You take ${ctx.fmt(damage)} damage.`);
      ctx.shake();
      await ctx.wait(800);
      if (ctx.playerHP <= 0) ctx.lose();
    },

    async onDefeat(ctx) {
      ctx.bossAttackEnabled(false);
      ctx.state.finishShown = true;
      ctx.setCharacter(ctx.boss.defeat);
      ctx.setPhase("KORTHAS DEFEATED // FINISH HIM");
      ctx.setStatus("DEFEATED // BARELY BREATHING");
      ctx.showFlash();
      ctx.shake();

      for (const line of ctx.boss.defeat) {
        ctx.setMessage(line);
        ctx.addMessageClass("defeat-text");
        await ctx.wait(line === "....." ? 850 : 1300);
      }
      ctx.removeMessageClass("defeat-text");

      const grid = document.getElementById("attack-grid");
      [...grid.children].forEach(x => x.classList.add("defeat-fade"));
      await ctx.wait(620);
      grid.classList.add("finishing-state");
      grid.innerHTML = "";

      const finish = document.createElement("button");
      finish.className = "finish-him-button";
      finish.innerHTML = "<span>FINISH HIM</span><small>THE FINAL BLOW</small>";
      finish.onclick = async () => {
        if (ctx.isBusy()) return;
        ctx.setBusy(true);
        finish.disabled = true;
        ctx.setMessage("FINISH HIM...");
        await ctx.wait(500);
        finish.classList.add("knocked-away");
        await ctx.playParryEffect(ctx.boss.parrySound);
        ctx.setMessage("— PARRY —");
        ctx.addMessageClass("parry-text");
        ctx.shake();
        ctx.showFlash();
        await ctx.wait(550);
        ctx.removeMessageClass("parry-text");
        await this.summonEmpress(ctx);
        ctx.setBusy(false);
      };
      grid.appendChild(finish);
      document.getElementById("attack-count").textContent = "01 FINAL BLOW";
      setTimeout(() => finish.classList.add("shaking-letters"), 80);
      ctx.setBusy(false);
    },

    async summonEmpress(ctx) {
      ctx.state.empress = true;
      ctx.state.empressHP = ctx.boss.empress.maxHP;
      ctx.bossAttackEnabled(false);
      ctx.setBossName(ctx.boss.empress.name);
      ctx.setBossLevel(ctx.boss.empress.level);
      ctx.setBossKicker(ctx.boss.empress.title);
      ctx.setStatus("THE EMPRESS HAS ARRIVED");
      ctx.setPhase("PHASE THREE // THE EMPRESS");
      ctx.setBossAura("empress-aura");
      ctx.setBossNameClass("empress-name");
      ctx.setCharacter(ctx.boss.empress.image);
      ctx.buildAttackButtons();
      document.getElementById("attack-grid").classList.add("empress-state");
      ctx.updateHP();

      for (let i = 0; i < ctx.boss.empress.lines.length; i++) {
        ctx.setMessage(ctx.boss.empress.lines[i]);
        if (i >= 4) { ctx.addMessageClass("empress-rage"); ctx.shake(); }
        await ctx.wait(i >= 4 ? 500 : 950);
      }
      ctx.removeMessageClass("empress-rage");
      ctx.setMessage("Empress raises her sword. She is watching every move.");
      ctx.bossAttackEnabled(true);
    },

    async playerAttackDuringEmpress(ctx, attack) {
      const base = ctx.attackToRange(attack);
      if (Math.random() < ctx.boss.empress.parryChance) {
        ctx.setMessage("EMPRESS PARRIES YOUR ATTACK.");
        ctx.addMessageClass("parry-text");
        ctx.shake();
        await ctx.playParryEffect(ctx.boss.empress.parrySound);
        const slash = document.createElement("div");
        slash.className = "empress-slash";
        document.body.appendChild(slash);
        await ctx.wait(330);
        slash.remove();
        const damage = ctx.randomInt(18000, 34000);
        ctx.damagePlayer(damage);
        ctx.setMessage(`Empress cuts through your guard. ${attack.name || attack[0]} is sealed for 19 seconds.`);
        ctx.cooldownAttack(attack, 19000);
        ctx.removeMessageClass("parry-text");
        await ctx.wait(750);
        if (ctx.playerHP <= 0) ctx.lose();
        return;
      }

      const damage = Math.min(ctx.state.empressHP, ctx.randomInt(base.min, base.max));
      ctx.state.empressHP -= damage;
      ctx.updateHP();
      ctx.setMessage(`Your attack lands. Empress takes ${ctx.fmt(damage)} damage.`);
      await ctx.wait(750);

      if (ctx.state.empressHP <= 0) {
        await ctx.completeVictory(ctx.boss.reward + 500000, "EMPRESS");
        return;
      }
      await this.bossTurn(ctx);
    },

    async bossTurnDuringEmpress(ctx) {
      return this.bossTurn(ctx);
    }
  }
};
