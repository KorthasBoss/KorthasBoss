/*
==========================================================
 YEN! // SEA PREDATOR
==========================================================
A completely independent endgame Kishin boss.
==========================================================
*/
window.YEN_BOSSES=window.YEN_BOSSES||{};
window.YEN_BOSSES.seaPredator={
  id:"sea-predator",
  name:"SEA PREDATOR",
  stars:250000000,
  title:"THE KISHIN OF THE ABYSSAL SHELL",
  battleTitle:"THE OCEAN'S LAST PREDATOR",
  maxHP:500000000,
  playerMaxHP:2500000,
  reward:100000000000,
  rewardSkill:"trident-of-co-op",
  cardImage:"assets/sea-predator.png",
  profileFrame:"assets/sea-predator-card-frame.png",
  idle:"assets/sea-predator.png",
  fight:"assets/sea-predator.png",
  music:"assets/twowingbeats-fighting-on-the-sea-soundtrack-238097.mp3",
  battleBackground:"assets/d1a0ca74-47dc-43dc-8944-1398096f0390.png",
  shellNullChance:0.28,
  shellReduceChance:0.34,
  shellReducedDamage:25000,
  intro:["The water goes silent.","Something enormous moves beneath the arena.","SEA PREDATOR rises.","Its shell is older than the world you came from.","Come closer."],
  playerAttacks:[
    ["ABYSSAL SLASH",150000,250000,["Your weapon crashes against the ancient shell.","The ocean shakes from the impact."]],
    ["SOUL BREAKER",190000,310000,["You force your attack through the pressure.","The shell finally gives a little."]],
    ["KISHIN STRIKE",240000,380000,["A monstrous strike tears through the tide.","SEA PREDATOR roars beneath the waves."]]
  ],
  attacks:{
    abyssalTrident:{name:"ABYSSAL TRIDENT",damage:[420000,650000]},
    leviathanCrash:{name:"LEVIATHAN CRASH",damage:[650000,900000]},
    tidalGuillotine:{name:"TIDAL GUILLOTINE",hits:5,damagePerHit:170000},
    shellJudgment:{name:"SHELL JUDGMENT",damage:[800000,1150000]},
    blackTide:{name:"BLACK TIDE",damage:[950000,1350000]},
    oceanDevourer:{name:"OCEAN DEVOURER",damage:[1200000,1700000]},
    coOpTrident:{name:"CO-OP TRIDENT // ABYSSAL EXECUTION",damage:[1800000,2400000]}
  },
  hooks:{
    createState(){return {shellCounter:0};},
    async beforePlayerAttack(ctx,attack){
      const roll=Math.random();
      if(roll<ctx.boss.shellNullChance){
        const v=document.createElement("div");v.className="sea-shell-null-vfx";document.body.appendChild(v);
        ctx.setMessage(`SEA PREDATOR'S SHELL REJECTS ${attack.name}. YOUR ATTACK DOES NOTHING.`);
        ctx.showFlash();ctx.shake();await ctx.wait(650);v.remove();return true;
      }
      if(roll<ctx.boss.shellNullChance+ctx.boss.shellReduceChance){
        attack._seaReducedDamage=ctx.boss.shellReducedDamage;
        const v=document.createElement("div");v.className="sea-shell-hit-vfx";document.body.appendChild(v);
        ctx.setMessage(`THE ANCIENT SHELL ABSORBS MOST OF ${attack.name}.`);
        await ctx.wait(450);v.remove();
      }
      return false;
    },
    async bossTurn(ctx){
      const r=Math.random();
      if(r<0.14)return this.abyssalTrident(ctx);
      if(r<0.29)return this.leviathanCrash(ctx);
      if(r<0.45)return this.tidalGuillotine(ctx);
      if(r<0.60)return this.shellJudgment(ctx);
      if(r<0.76)return this.blackTide(ctx);
      if(r<0.90)return this.oceanDevourer(ctx);
      return this.coOpTrident(ctx);
    },
    async hit(ctx,name,damage,klass,delay=650){
      const v=document.createElement("div");v.className=klass;document.body.appendChild(v);
      ctx.setMessage(name);await ctx.wait(delay);ctx.showFlash();ctx.shake();ctx.damagePlayer(Math.min(ctx.playerHP,damage));ctx.updateHP();await ctx.wait(650);v.remove();
      if(ctx.playerHP<=0)ctx.lose();
    },
    async abyssalTrident(ctx){const d=ctx.randomInt(...ctx.boss.attacks.abyssalTrident.damage);await this.hit(ctx,"SEA PREDATOR // ABYSSAL TRIDENT",d,"sea-trident-vfx");},
    async leviathanCrash(ctx){const d=ctx.randomInt(...ctx.boss.attacks.leviathanCrash.damage);await this.hit(ctx,"LEVIATHAN CRASH // THE ENTIRE ARENA BREAKS",d,"sea-crash-vfx",700);},
    async tidalGuillotine(ctx){const a=ctx.boss.attacks.tidalGuillotine;ctx.setMessage("TIDAL GUILLOTINE // FIVE OCEAN BLADES");for(let i=1;i<=a.hits;i++){if(ctx.playerHP<=0)return;const v=document.createElement("div");v.className="sea-tidal-slash";v.style.setProperty("--sea-index",String(i));document.body.appendChild(v);const d=Math.min(ctx.playerHP,a.damagePerHit);ctx.damagePlayer(d);ctx.updateHP();ctx.shake();ctx.setMessage(`TIDAL GUILLOTINE // ${i}/${a.hits}. ${ctx.fmt(d)} DAMAGE.`);await ctx.wait(115);v.remove();}if(ctx.playerHP<=0)ctx.lose();},
    async shellJudgment(ctx){const d=ctx.randomInt(...ctx.boss.attacks.shellJudgment.damage);await this.hit(ctx,"SHELL JUDGMENT // THE KISHIN SHELL OPENS",d,"sea-shell-judgment-vfx",800);},
    async blackTide(ctx){const d=ctx.randomInt(...ctx.boss.attacks.blackTide.damage);await this.hit(ctx,"BLACK TIDE // THE SEA FORGETS YOUR NAME",d,"sea-black-tide-vfx",900);},
    async oceanDevourer(ctx){const d=ctx.randomInt(...ctx.boss.attacks.oceanDevourer.damage);await this.hit(ctx,"OCEAN DEVOURER // EVERYTHING GETS DRAGGED UNDER",d,"sea-devour-vfx",1000);},
    async coOpTrident(ctx){const d=ctx.randomInt(...ctx.boss.attacks.coOpTrident.damage);await this.hit(ctx,"CO-OP TRIDENT // ABYSSAL EXECUTION",d,"sea-coop-vfx",1100);}
  }
};
