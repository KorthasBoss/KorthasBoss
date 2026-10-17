/* YEN! // ARGUS BOSS SCRIPT
   Argus owns all of his shield, parry, reload, rapid-fire and healing rules.
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.argus = {
  id: "argus",
  name: "ARGUS",
  stars: 79,
  title: "THE LAST GUNNER",
  maxHP: 2000000,
  playerMaxHP: 180000,
  reward: 5000000,
  shield: 3000,
  cardImage: "assets/argus.png",
  idle: "assets/argus.png",
  fight: "assets/argus.png",
  music: "assets/korthas-theme.mp3",
  battleBackground: "assets/Background.gif",
  parrySound: "assets/argus-gun.mp3",
  reloadSound: "assets/argus-reload.mp3",
  gunImage: "assets/argus-gun.png",
  parryChance: 0.52,
  rapidBlastChance: 0.42,
  extraShotChance: 0.38,
  healChance: 0.20,
  playerAttacks: [
    ["VOID SLASH",9000,21000,["Your void slash tears through the dark.","The slash catches Argus clean.","A blue wound of light opens across his guard."]],
    ["RUNE BURST",7000,26000,["Runes detonate around Argus.","The burst rattles his shield.","Ancient symbols burn through the smoke."]],
    ["SOUL PIERCE",11000,19000,["You pierce the gunner's guard.","The hit lands with a brutal crack.","Argus's stance breaks for a second."]],
    ["ECHO BOLT",6000,28000,["An echo bolt snaps across the arena.","The bolt punches into Argus.","The shot is answered by a burst of blue light."]],
    ["TOME SHARD",8000,24000,["A Tome shard cuts through the air.","The shard detonates against his armor.","Ancient lettering flashes across his weapon."]],
    ["STARFALL",10000,22000,["A star crashes down on Argus.","The arena flashes white.","The impact sends a shock through his shield."]],
    ["DREAD WAVE",5000,30000,["A wave of dread rolls over the gunner.","Argus is forced backward.","The wave tears through his firing line."]],
    ["LAST WORD",12000,20000,["Your final word hits like a sentence.","The air cracks around Argus.","The gunner finally looks worried."]]
  ],
  bossAttacks: [["HAND CANNON",15000,27000],["BLACK ROUND",12000,24000],["EXECUTION SHOT",18000,30000]],
  intro: ["I have watched a thousand like you fall. You will be no different."],
  rapid: "That's all you got? Fuck it.",

  hooks: {
    createState() { return {}; },

    async beforePlayerAttack(ctx, attack) {
      if (Math.random() >= ctx.boss.parryChance) return false;
      const name = attack.name || attack[0];
      ctx.setMessage(`ARGUS raises his weapon. ${name} is caught in the sightline.`);
      const line = document.createElement("div");
      line.className = "gun-line";
      document.body.appendChild(line);
      await ctx.wait(150);
      line.remove();
      await ctx.playAudio(ctx.boss.parrySound, .95, true, true);
      ctx.showFlash();
      ctx.shake();
      ctx.cooldownAttack(attack, 20000);
      ctx.damagePlayer(30000);
      ctx.updateHP();
      ctx.setMessage("ARGUS: Reloading.");
      await ctx.playAudio(ctx.boss.reloadSound, .7);
      ctx.setMessage("He reloaded.");
      await ctx.wait(350);
      if (ctx.playerHP <= 0) ctx.lose();
      return true;
    },

    async bossTurn(ctx) {
      if (Math.random() < ctx.boss.healChance) {
        const heal = ctx.randomInt(100000,260000);
        ctx.bossHP = Math.min(ctx.boss.maxHP, ctx.bossHP + heal);
        ctx.updateHP();
        ctx.setMessage(`ARGUS repairs himself. +${ctx.fmt(heal)} HP.`);
        ctx.showFlash();
        await ctx.wait(700);
        return;
      }

      if (Math.random() < ctx.boss.rapidBlastChance) {
        ctx.setMessage(ctx.boss.rapid);
        ctx.addMessageClass("argus-rage");
        ctx.shake();
        await ctx.wait(280);
        ctx.removeMessageClass("argus-rage");
        const shots = 3 + (Math.random() < ctx.boss.extraShotChance ? 1 : 0);
        for (let i=0;i<shots;i++) {
          const flash = document.createElement("div");
          flash.className = "rapid-flash";
          document.body.appendChild(flash);
          setTimeout(()=>flash.remove(),280);
          ctx.playAudio(ctx.boss.parrySound,.9,true,false);
          const damage = Math.min(ctx.playerHP,19000);
          ctx.damagePlayer(damage);
          ctx.updateHP();
          ctx.setMessage(`RAPID BLAST // SHOT ${i+1} OF ${shots}. You take ${ctx.fmt(damage)} damage.`);
          ctx.shake();
          await ctx.wait(18);
          if (ctx.playerHP <= 0) { ctx.lose(); return; }
        }
        await ctx.playAudio(ctx.boss.reloadSound,.7);
        ctx.setMessage("Argus reloads.");
        return;
      }

      const damage = Math.min(ctx.playerHP,ctx.randomInt(15000,27000));
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`Argus fires once. You take ${ctx.fmt(damage)} damage.`);
      ctx.shake();
      await ctx.wait(700);
      if (ctx.playerHP <= 0) ctx.lose();
    }
  }
};
