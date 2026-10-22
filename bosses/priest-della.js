/*
==========================================================
 YEN! // PRIEST DELLA
==========================================================
Della owns her own shop catalog and her own boss logic.
Change her 340 shop skills here without touching Merchant.
==========================================================
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_DELLA = {
  name: "PRIEST DELLA",
  image: "assets/Della.png",
  background: "assets/priest della.jpg",
  cardFrame: "assets/priest_della_card.png",
  cardImage: "assets/Della.png",
  music: "assets/merchant-theme.mp3",
  lines: [
    "Morning Hunter..",
    "My name is Priest Della. just call; me Della for short.",
    "You must be {PLAYER} everyone been talking about.",
    "Hope my shop makes use for you."
  ],
  skills: []
};

(() => {
  const D = window.YEN_DELLA;
  const prefixes = ["Heaven","Grave","Saint","Velvet","Hollow","Astral","Blood","Choir","Moon","Vesper","Ruin","Crown","Seraph","Night","Thorn","Divine","Black","Golden","Wicked","Last"];
  const cores = ["Execution","Judgment","Requiem","Crush","Nova","Rend","Eclipse","Barrage","Spear","Rift","Cataclysm","Sunder","Meteor","Covenant","Massacre","Fall","Piercer"];
  const vfx = [
    ["della-vfx-crimson","CRIMSON"],
    ["della-vfx-violet","VIOLET"],
    ["della-vfx-gold","DIVINE"],
    ["della-vfx-void","VOID"],
    ["della-vfx-white","SAINT"],
    ["della-vfx-blood","BLOOD"],
    ["della-vfx-cosmic","COSMIC"],
    ["della-vfx-cataclysm","CATASTROPHE"]
  ];
  const rarity = [
    {name:"UNHOLY",color:"#d65cff",mult:1,costMin:"5000000000",costMax:"90000000000",powerMin:250000,powerMax:900000},
    {name:"SAINTED",color:"#fff0a6",mult:1.5,costMin:"90000000000",costMax:"900000000000",powerMin:600000,powerMax:1600000},
    {name:"KISHIN",color:"#ff4f88",mult:2.2,costMin:"900000000000",costMax:"9000000000000",powerMin:1200000,powerMax:3200000},
    {name:"EXECUTIONER",color:"#6ce7ff",mult:3.2,costMin:"9000000000000",costMax:"90000000000000",powerMin:2500000,powerMax:7000000},
    {name:"DELLA'S SIN",color:"#ffffff",mult:5,costMin:"90000000000000",costMax:"9000000000000000",powerMin:6000000,powerMax:18000000}
  ];
  let id=0;
  const bigRand=(a,b)=>{
    const A=BigInt(a), B=BigInt(b);
    const span=B-A;
    const r=BigInt((id*2654435761)>>>0);
    return A + (span * r / 4294967296n);
  };
  for(const r of rarity){
    for(let i=0;i<68;i++){
      const name=`${prefixes[(id*5+i)%prefixes.length]} ${cores[(id*11+i*3)%cores.length]} ${String(i+1).padStart(3,"0")}`;
      const v=vfx[id%vfx.length];
      const power=Math.floor((r.powerMin+(r.powerMax-r.powerMin)*(((id*1103515245+12345)>>>0)/4294967296))*r.mult);
      D.skills.push({
        id:`della-${String(id).padStart(3,"0")}`,
        name,
        rarity:r.name,
        color:r.color,
        enchanted:true,
        cost:bigRand(r.costMin,r.costMax).toString(),
        power,
        vfxClass:v[0],
        vfxName:v[1],
        killEffect:true,
        breakChance:0.08 + (id%5)*0.025,
        description:`A ${r.name.toLowerCase()} Della technique. ${v[1]} VFX, execution impact, and a chance to shatter a target skill. Cost is intentionally extreme.`
      });
      id++;
    }
  }

})();

;

window.YEN_BOSSES["priest-della"] = {
  id:"priest-della",
  name:"PRIEST DELLA",
  stars:500000000,
  title:"THE SHOPKEEPER WHO SHOULD NOT BE FOUGHT",
  battleTitle:"DELLA HAS DECIDED TO STOP SMILING",
  maxHP:125000000,
  playerMaxHP:2500000,
  reward:750000000000,
  rewardSkill:"no-saki",
  cardImage:"assets/priest_della_card.png",
  profileFrame:"assets/priest_della_card.png",
  idle:"assets/Della.png",
  fight:"assets/Della.png",
  music:"assets/merchant-theme.mp3",
  battleBackground:"assets/priest della.jpg",
  battleClass:"della-battle",
  intro:["...","Fine.","Don't whine to you're mother when you lose."],
  playerAttacks:[
    ["DELLA'S FIRST WARNING",160000,220000,["Della sighs.","Della barely looks impressed."]],
    ["HOLY BREAKER",220000,320000,["The strike cracks through the sanctuary.","Della smiles like she planned this."]],
    ["GRAVE LANCE",300000,450000,["A lance of light tears through the room.","Della whispers something you were not meant to hear."]],
    ["BLACK SERMON",380000,560000,["The sermon becomes a weapon.","The floor answers Della."]],
    ["JUDGMENT RAIN",500000,700000,["Hundreds of glowing blades descend.","Della laughs."]],
    ["SAINT'S END",650000,900000,["A forbidden saintly execution begins.","The arena flashes white."]],
    ["MOTHERLESS FATE",800000,1100000,["Della points at you.","Something enormous answers."]]
  ],
  attacks:{},
  hooks:{
    createState(){return {tauntIndex:0,stolenSkill:null};},
    async onStart(ctx){
      ctx.setPhaseLabel("DELLA // NO LONGER SELLING");
      ctx.setMessage("...");
      await ctx.wait(650);
      ctx.setMessage("Fine.");
      await ctx.wait(650);
      ctx.setMessage("Don't whine to you're mother when you lose.");
    },
    async beforePlayerAttack(ctx,attack){
      if(Math.random()<0.12){
        const v=document.createElement("div");v.className="della-counter-vfx";document.body.appendChild(v);
        ctx.setMessage(`DELLA LAUGHS. "${attack.name}"? YOU REALLY THOUGHT THAT WOULD WORK?`);
        ctx.showFlash();ctx.shake();await ctx.wait(650);v.remove();
        return true;
      }
      return false;
    },
    async bossTurn(ctx){
      const taunts=[
        "Morning Hunter. Still alive?",
        "That was your big attack?",
        "Della is starting to get bored.",
        "You bought all those skills just to do THAT?",
        "Go on. Try something expensive.",
        "Oh no. Was that supposed to hurt?",
        "I could sell you a better weapon after this."
      ];
      if(Math.random()<0.46){
        const owned=Array.isArray(ctx.account?.ownedSkills) ? ctx.account.ownedSkills : [];
        const candidates=owned.map(v=>ctx.findSkill(v)).filter(Boolean).filter(x=>!x.rewardOnly || String(x.id)==="no-saki");
        if(candidates.length){
          const skill=candidates[Math.floor(Math.random()*candidates.length)];
          const power=Math.max(150000,Math.round(Number(skill.power||300000)*(0.9+Math.random()*0.55)));
          ctx.setMessage(`DELLA STEALS YOUR SKILL: ${skill.name}. SHE USES IT AGAINST YOU.`);
          const v=document.createElement("div");v.className=`della-steal-vfx ${skill.vfxClass||"della-vfx-violet"}`;document.body.appendChild(v);
          await ctx.wait(500);ctx.damagePlayer(Math.min(ctx.playerHP,power));ctx.updateHP();ctx.shake();await ctx.wait(600);v.remove();
          if(ctx.playerHP<=0)ctx.lose();
          return;
        }
      }
      const line=taunts[(ctx.state.tauntIndex++)%taunts.length];
      const damage=ctx.randomInt(700000,1250000);
      const v=document.createElement("div");v.className="della-taunt-vfx";document.body.appendChild(v);
      ctx.setMessage(`${line} // ${ctx.fmt(damage)} DAMAGE.`);
      await ctx.wait(450);ctx.damagePlayer(Math.min(ctx.playerHP,damage));ctx.updateHP();ctx.shake();await ctx.wait(700);v.remove();
      if(ctx.playerHP<=0)ctx.lose();
    }
  }
};
