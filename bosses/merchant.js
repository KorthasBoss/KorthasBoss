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
  /*
     THE OLD RANDOM 8,000-SKILL VAULT IS REPLACED WITH A SMALLER
     ENDGAME-ONLY STOCK. These are intentionally absurdly expensive.
  */
  M.skills.push(
    {id:"void-king-execution",name:"VOID KING // EXECUTION",rarity:"KISHIN",color:"#b45cff",enchanted:true,cost:"5000000000",power:6500000,description:"A forbidden execution that tears through ancient bosses."},
    {id:"astral-cataclysm",name:"ASTRAL CATACLYSM",rarity:"KISHIN",color:"#63e6ff",enchanted:true,cost:"7500000000",power:8200000,description:"Summons a collapsing star over the target."},
    {id:"blood-moon-requiem",name:"BLOOD MOON REQUIEM",rarity:"KISHIN",color:"#ff315d",enchanted:true,cost:"9000000000",power:9000000,description:"A crimson requiem that bites through boss vitality."},
    {id:"heavens-last-word",name:"HEAVEN'S LAST WORD",rarity:"DIVINE",color:"#fff6b0",enchanted:true,cost:"12000000000",power:12000000,description:"The final word of a dead god."},
    {id:"abyssal-collapse",name:"ABYSSAL COLLAPSE",rarity:"KISHIN",color:"#8a7dff",enchanted:true,cost:"15000000000",power:15000000,description:"Folds the arena into an abyssal singularity."},
    {id:"million-blade-judgment",name:"MILLION-BLADE JUDGMENT",rarity:"DIVINE",color:"#ffffff",enchanted:true,cost:"18000000000",power:17500000,description:"A storm of blades descends at once."},
    {id:"godfall-prism",name:"GODFALL PRISM",rarity:"DIVINE",color:"#ff8cf7",enchanted:true,cost:"22000000000",power:21000000,description:"A prism that turns divine light into raw damage."},
    {id:"dreadnought-sunder",name:"DREADNOUGHT SUNDER",rarity:"KISHIN",color:"#ff9b45",enchanted:true,cost:"26000000000",power:24000000,description:"Splits armor, shields, and pride in one hit."},
    {id:"zero-hour-obliteration",name:"ZERO HOUR // OBLITERATION",rarity:"KISHIN",color:"#54ffff",enchanted:true,cost:"35000000000",power:30000000,description:"An endgame strike reserved for hunters with absurd wealth."},
    {id:"merchant-forbidden-deal",name:"THE MERCHANT'S FORBIDDEN DEAL",rarity:"???",color:"#ffea5c",enchanted:true,cost:"50000000000",power:50000000,description:"The Merchant refuses to explain where this came from."}
  );
})();
