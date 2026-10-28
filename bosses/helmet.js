/* YEN! // HELMET // SECOND MERCHANT + PRIVATE KISHIN SHOP */
window.YEN_HELMET = {
  image:"assets/Helmet.png",
  background:"assets/Marketplace_29.webp",
  shopBackground:"assets/Marketplace_29.webp",
  lines:[
    "WOAH WOAH WOAH.",
    "Hey!",
    "My name is Helmet I DIDN'T THINK Hunters were alive here still.",
    "Let me see you're ID.",
    "Hmmmm..",
    "OHH. you're [PLAYER] I know you!",
    "Good looks. that you're still alive.",
    "But AYE? since you're still here,",
    "Come shop for one of my FINEST KISHINS aye?"
  ],
  subLines:[
    "",
    "HEY! YOU ACTUALLY MADE IT THIS FAR?",
    "Helmet // Kishin Dealer",
    "IDENTITY REQUESTED",
    "SCANNING...",
    "IDENTITY MATCH // HUNTER RECOGNIZED",
    "YOU'VE GOT GOOD SURVIVAL INSTINCTS.",
    "THEN YOU'RE READY FOR MY PRIVATE INVENTORY.",
    "WILL YOU BUY ONE OF MY FINEST KISHINS?"
  ],
  targets:[
    {id:"auralis-nyxara",name:"Auralis & Nyxara",rarity:"KISHIN // DUO",color:"#ff6df2",image:"assets/Auralis & Nyxara.png",cost:"999999999999",bio:"Auralis and Nyxara are the strongest duo Helmet keeps hidden from normal hunters. Purchase them and both enter your skill roster together, striking for 800,000 damage each.",shopEffect:"800,000 DAMAGE EACH // 4 USES PER BATTLE"},
    {id:"fallen-samurai-90k",name:"90K Fallen Samurai",rarity:"KISHIN // SAMURAI",color:"#ff334f",image:"assets/9Pk Fallen samurai.png",cost:"5000000000000",bio:"A cursed samurai whose blade can carve seven million HP from a target. His timing is so vicious that he can parry a target and erase its next turn.",shopEffect:"7,000,000 DAMAGE // 35% PARRY CHANCE"},
    {id:"xenith-01-world-weaver",name:"Xenith-01: The World Weaver",rarity:"KISHIN // WORLD WEAVER",color:"#6cf6ff",image:"assets/Xenith-01 The World Weaver.png",cost:"25000000000000",bio:"Xenith-01 weaves reality into a colossal beam. It can also convert the stolen energy into a massive heal for its owner.",shopEffect:"12,000,000 DAMAGE // 45% HEAL CHANCE"},
    {id:"lord-zephyrus-ivory-overlord",name:"Lord Zephyrus, the Ivory Overlord",rarity:"KISHIN // IVORY OVERLORD",color:"#fff3c4",image:"assets/Lord Zephyrus, the Ivory Overlord.png",cost:"100000000000000",bio:"The private crown jewel of Helmet's stock. Zephyrus brings a catastrophic ivory execution built for hunters with truly absurd DOX.",shopEffect:"30,000,000 DAMAGE // IVORY OVERLORD EXECUTION"}
  ]
};
window.YEN_HELMET.lines = window.YEN_HELMET.lines.map(line => line.replace("[PLAYER]", "${PLAYER}"));
