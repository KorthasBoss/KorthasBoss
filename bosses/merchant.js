/*
==========================================================
 YEN! // MERCHANT VAULT
==========================================================
Everything sold by the Merchant lives here.
Edit price/power/color/enchanted/imageId here without touching
script.js or any boss script.
==========================================================
*/
window.YEN_MERCHANT = {
  image: "assets/Merchant_Idle.png",
  background: "assets/Merchant_background.gif",
  music: "assets/merchant-theme.mp3",
  lines: [
    "Oh you're back.","Welcome back, hunter.","You look like somebody who needs a better skill.","I don't ask where you got that DOX.","You survived. That's enough for me.","The vault is open. Try not to go broke.","I've seen your type before.","You fight loud. I sell louder.","Pick something nasty.","Some skills bite back.","Enchanted ones cost what they cost.","Don't stare at the price. Earn more.","You want power? Pay for it.","I keep the good stuff behind the expensive stuff.","A cheap skill can still save your life.","A rare skill can ruin somebody else's.","The vault has eight thousand answers.","You only need one.","Unless you're greedy.","Greedy is fine here.","That one? Interesting choice.","I wouldn't use it against Argus first.","Korthas hates flashy skills.","Argus hates everything.","The enchanted stock is temperamental.","Buy before the price feels worse.","You came back with more DOX.","Now you're speaking my language.","A hunter without skills is just target practice.","A hunter with too many skills is expensive target practice.","I've got something mean today.","I've got something beautiful today.","I've got something that should probably be illegal.","Relax. It's only a game.","Probably.","You want the vault? Hit the button.","Don't make me repeat myself.","The good stuff is glowing for a reason.","That purple glow means trouble.","The gold ones hurt wallets.","The red ones hurt bosses.","The blue ones save mistakes.","Buy wisely.","Or don't. I still get paid.","You look ready.","You're almost dangerous.","Almost.","Come back after another boss.","I'll have more bad ideas waiting.","Now go make me proud.","Welcome back, hunter."
  ],
  skills: [],
  potions: [
    {id:"minor",name:"MINOR HEALING POTION",heal:25000,cost:25000,description:"Restores 25,000 HP."},
    {id:"greater",name:"GREATER HEALING POTION",heal:60000,cost:125000,description:"Restores 60,000 HP."},
    {id:"soul",name:"SOUL FLASK",heal:110000,cost:450000,description:"Restores 110,000 HP."},
    {id:"royal",name:"ROYAL ELIXIR",heal:150000,cost:1500000,description:"Restores 150,000 HP."},
    {id:"immortal",name:"IMMORTAL DRAUGHT",heal:999999,cost:12000000,description:"Restores your entire soul."},
    {id:"crimson",name:"CRIMSON REPAIR",heal:130000,cost:900000,description:"Restores 130,000 HP."},
    {id:"void",name:"VOID HEART TONIC",heal:165000,cost:3000000,description:"Restores 165,000 HP."},
    {id:"divine",name:"DIVINE SOUL ELIXIR",heal:180000,cost:7500000,description:"Restores your full soul and can be used at critical health."},
    {id:"last",name:"LAST BREATH VIAL",heal:999999,cost:25000000,description:"A forbidden emergency potion. Restores your entire soul."}
  ]
};

(() => {
  const M=window.YEN_MERCHANT;
  const prefixes=["Void","Astral","Dread","Soul","Rune","Blood","Echo","Fallen","Solar","Night","Grave","Tome","Royal","Phantom","Seraph","Ruin","Star","Cursed","Abyssal","Thorn"];
  const cores=["Slash","Burst","Pierce","Nova","Judgment","Wave","Prism","Chain","Rift","Pulse","Meteor","Brand","Requiem","Tempest","Execution","Sigil","Crash","Sunder","Fang","Cannon"];
  const rarities=[
    {name:"COMMON",count:1600,color:"#7e94ae",mult:1,cost:[12000,70000]},
    {name:"RARE",count:1000,color:"#54cfff",mult:1.25,cost:[70000,250000]},
    {name:"EPIC",count:700,color:"#bd72ff",mult:1.7,cost:[250000,900000]},
    {name:"LEGENDARY",count:500,color:"#ffb84e",mult:2.4,cost:[900000,3500000]},
    {name:"MYTHIC",count:200,color:"#ff5573",mult:3.2,cost:[3500000,10000000]},
    {name:"ENCHANTED",count:4000,color:"#f6b4ff",mult:8.5,cost:[25000000,500000000]}
  ];
  let id=0;
  for(const rarity of rarities){
    for(let i=0;i<rarity.count;i++){
      const name=`${prefixes[(id*7)%prefixes.length]} ${cores[(id*11+i)%cores.length]} ${String(i+1).padStart(3,"0")}`;
      const seed=(id*1103515245+12345)>>>0;
      const ratio=seed/4294967296;
      const powerMin=rarity.name==="ENCHANTED"?90000:9000;
      const powerMax=rarity.name==="ENCHANTED"?220000:60000;
      const power=Math.round((powerMin+(powerMax-powerMin)*ratio)*rarity.mult);
      const cost=Math.floor(rarity.cost[0]+(rarity.cost[1]-rarity.cost[0])*ratio);
      M.skills.push({id:String(id),name,rarity:rarity.name,color:rarity.color,enchanted:rarity.name==="ENCHANTED",cost,power,description:rarity.name==="ENCHANTED"?`ENCHANTED ENDGAME SKILL. Deals around ${power.toLocaleString("en-US")} damage. Extremely expensive and built to hurt bosses.`:`A ${rarity.name.toLowerCase()} skill. Deals around ${power.toLocaleString("en-US")} damage when it lands.`});
      id++;
    }
  }
  M.skills.push({
    id:"win-can-make-sword",name:"WIN CAN MAKE SWORD",rarity:"DIVINE // CUSTOM",color:"#ffffff",enchanted:true,rainbow:true,special:"rainbow-sword",breakChance:0.04,cost:8000000,power:200000,
    description:"A forbidden rainbow blade. Deals exactly 200,000 damage and has a 4% chance to shatter after use."
  });
  M.skills.push({
    id:"trident-of-co-op",name:"TRIDENT OF CO-OP",rarity:"KISHIN // RELIC",color:"#55f5ff",enchanted:true,special:"trident-of-co-op",imageId:"trident-of-co-op-card",image:"assets/trident-of-co-op.png",cost:0,power:2500000,rewardOnly:true,
    description:"SEA PREDATOR'S forbidden cooperative trident. Deals exactly 2,500,000 damage and tears open the arena with a colossal ocean VFX."
  });
})();
