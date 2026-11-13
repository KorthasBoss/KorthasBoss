/* YEN! // STARLYLANDS // FALLEN CONSTELLATION */
window.YEN_BOSSES = window.YEN_BOSSES || {};

const STARLYLANDS_MOVES = [
  {name:"HEARTS OF THE FALLEN",damage:[900000,1250000],vfx:"starfall"},
  {name:"JUDGE THE STARS OF FALLEN",hits:5,damagePerHit:280000,vfx:"judgment"},
  {name:"COMET OF LAST LIGHT",damage:[1100000,1450000],vfx:"starfall"},
  {name:"BLUE STAR DELUGE",hits:7,damagePerHit:205000,vfx:"judgment"},
  {name:"ASTRAL COLLAPSE",damage:[1350000,1700000],vfx:"judgment"},
  {name:"FALLEN CONSTELLATION",damage:[1750000,2150000],vfx:"judgment"},
  {name:"EVENT HORIZON",damage:[1200000,1550000],vfx:"starfall"},
  {name:"STARLESS MERCY",heal:65000000,vfx:"mercy"},
  {name:"ORBITAL SENTENCE",damage:[1450000,1850000],vfx:"judgment"}
];

window.YEN_BOSSES.starlylands = {
  id:"starlylands",
  name:"STARLYLANDS",
  stars:900000000,
  title:"THE FALLEN CONSTELLATION // STARFALL NEVER ENDS",
  battleTitle:"THE SKY HAS DECIDED YOU ARE IN THE WAY",
  maxHP:1300000000,
  playerMaxHP:3000000,
  reward:180000000000,
  cardImage:"assets/StarlyLands.png",
  idle:"assets/StarlyLands.png",
  fight:"assets/StarlyLands.png",
  music:"assets/oceans.mp3",
  battleBackground:"assets/domain-background.svg",
  battleClass:"starlylands-battle",
  moves:STARLYLANDS_MOVES,
  intro:["The constellations rearrange themselves.","A blue star blinks out. Then every star does.","STARLYLANDS is already counting your moves.","The sky will not give you room to breathe."],
  playerAttacks:[
    ["HUNTER'S CUT",180000,280000,["Your blade flashes against the star armor.","A spark falls upward into the dark."]],
    ["ORBIT BREAKER",250000,390000,["You strike between two drifting stars.","The constellation skips out of alignment."]],
    ["LAST LIGHT",320000,470000,["Your attack catches StarlyLands in its orbit.","A single star fractures."]]
  ],
  hooks:{
    createState(){return {attempts:0,turn:0,cleanHits:0};},
    async beforePlayerAttack(ctx,attack){
      ctx.state.attempts++;
      if(ctx.state.attempts%4!==0&&Math.random()>=0.12)return false;
      window.YEN_PLAY_STARLY_VFX?.(`FALSE STAR // ${attack.name} IS ERASED`,"judgment");
      ctx.setMessage(`FALSE STAR // STARLYLANDS ERASES ${attack.name} AND STRIKES BACK.`);
      await ctx.wait(450);
      await this.falseStar(ctx);
      return true;
    },
    async afterPlayerHit(ctx){
      ctx.state.cleanHits++;
      if(ctx.state.cleanHits<3)return;
      ctx.state.cleanHits=0;
      const healing=Math.min(65000000,ctx.boss.maxHP-ctx.bossHP);
      if(healing<=0)return;
      ctx.bossHP+=healing;
      window.YEN_PLAY_STARLY_VFX?.("STARLESS MERCY // THE CONSTELLATION REFORMS","mercy");
      ctx.updateHP();
      ctx.setMessage(`STARLESS MERCY // STARLYLANDS REFORMS ${ctx.fmt(healing)} HP.`);
      await ctx.wait(700);
    },
    async bossTurn(ctx){
      ctx.state.turn++;
      if(ctx.state.turn%5===0){
        await this.starfallBarrage(ctx);
        return;
      }
      const move=ctx.pick(ctx.boss.moves);
      if(move.heal){
        const healing=Math.min(move.heal,ctx.boss.maxHP-ctx.bossHP);
        ctx.bossHP+=healing;
        window.YEN_PLAY_STARLY_VFX?.(move.name,"mercy");
        ctx.updateHP();
        ctx.setMessage(`${move.name} // STARLYLANDS RESTORES ${ctx.fmt(healing)} HP.`);
        await ctx.wait(750);
        return;
      }
      if(move.hits){
        window.YEN_PLAY_STARLY_VFX?.(`${move.name} // THE SKY BREAKS INTO ${move.hits} WAVES`,move.vfx);
        for(let hit=1;hit<=move.hits;hit++){
          if(ctx.playerHP<=0)return;
          const damage=Math.min(ctx.playerHP,move.damagePerHit);
          ctx.damagePlayer(damage);
          ctx.updateHP();
          ctx.setMessage(`${move.name} // ${hit}/${move.hits} // ${ctx.fmt(damage)} DAMAGE.`);
          ctx.shake();
          await ctx.wait(150);
        }
        if(ctx.playerHP<=0)ctx.lose();
        return;
      }
      const damage=ctx.randomInt(...move.damage);
      window.YEN_PLAY_STARLY_VFX?.(move.name,move.vfx);
      ctx.setMessage(`STARLYLANDS // ${move.name}`);
      await ctx.wait(600);
      ctx.showFlash();
      ctx.shake();
      const dealt=Math.min(ctx.playerHP,damage);
      ctx.damagePlayer(dealt);
      ctx.updateHP();
      ctx.setMessage(`${move.name} // YOU TAKE ${ctx.fmt(dealt)} DAMAGE.`);
      await ctx.wait(650);
      if(ctx.playerHP<=0)ctx.lose();
    },
    async falseStar(ctx){
      window.YEN_PLAY_STARLY_VFX?.("FALSE STAR // A SECOND CONSTELLATION STRIKES","judgment");
      const damage=Math.min(ctx.playerHP,ctx.randomInt(420000,680000));
      ctx.showFlash();
      ctx.shake();
      ctx.damagePlayer(damage);
      ctx.updateHP();
      ctx.setMessage(`FALSE STAR // YOUR MOVE VANISHES. YOU TAKE ${ctx.fmt(damage)} DAMAGE.`);
      await ctx.wait(650);
      if(ctx.playerHP<=0)ctx.lose();
    },
    async starfallBarrage(ctx){
      const hits=4,damagePerHit=360000;
      window.YEN_PLAY_STARLY_VFX?.("ORBITAL SENTENCE // FOUR FALLEN STARS","judgment");
      for(let hit=1;hit<=hits;hit++){
        if(ctx.playerHP<=0)return;
        const damage=Math.min(ctx.playerHP,damagePerHit);
        ctx.damagePlayer(damage);
        ctx.updateHP();
        ctx.setMessage(`ORBITAL SENTENCE // ${hit}/${hits} // ${ctx.fmt(damage)} DAMAGE.`);
        ctx.shake();
        await ctx.wait(165);
      }
      if(ctx.playerHP<=0)ctx.lose();
    }
  }
};
