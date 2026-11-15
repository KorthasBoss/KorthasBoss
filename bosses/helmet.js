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
    {id:"japanhunter",name:"JapanHunter",rarity:"OFF-SALE // MYTHIC HUNTER",offSale:true,color:"#ff7b32",image:"assets/JapanHunter.png",cost:"999999999999999999999999999999",bio:"JapanHunter is an off-sale mythic Kishin. Its owner can wield Nihon no Owari, a catastrophic strike that tears through the arena beneath a burning red sun.",shopEffect:"1,000,000,000,000 DAMAGE // MYTHIC HUNTER // OFF-SALE"},
    {id:"k-z-x",name:"K,Z,X",rarity:"OFF-SALE // GLITCH ENTITY",offSale:true,color:"#ff38ff",image:"assets/k-z-x.png",cost:"999999999999999999",bio:"K,Z,X is a corrupted Kishin wrapped in rainbow static. Buy it and its attack is added to your battle skill roster. Every activation tears the target with a one-million-damage glitch slash and has a 67% chance to restore 67% of the hunter's maximum HP.",shopEffect:"1,000,000 DAMAGE // 67% CHANCE TO HEAL 67% MAX HP"},

    {id:"jorkaprime",name:"JorkaPrime",rarity:"OFF-SALE // PRIME KISHIN",offSale:true,color:"#ff263d",image:"assets/JorkaPrime.png",cost:"999999999999999999999999999",bio:"JorkaPrime is an off-sale prime Kishin. Its owner commands three devastating techniques, each with its own battle effect and voice line.",shopEffect:"THREE UNIQUE ATTACKS // PRIME EXECUTION // OFF-SALE"},
    {id:"auralis-nyxara",name:"Auralis & Nyxara",rarity:"KISHIN // DUO",color:"#ff6df2",image:"assets/Auralis & Nyxara.png",cost:"999999999999",bio:"Auralis and Nyxara are the strongest duo Helmet keeps hidden from normal hunters. Purchase them and both enter your skill roster together, striking for 800,000 damage each.",shopEffect:"800,000 DAMAGE EACH // 4 USES PER BATTLE"},
    {id:"fallen-samurai-90k",name:"90K Fallen Samurai",rarity:"KISHIN // SAMURAI",color:"#ff334f",image:"assets/9Pk Fallen samurai.png",cost:"5000000000000",bio:"A cursed samurai whose blade can carve seven million HP from a target. His timing is so vicious that he can parry a target and erase its next turn.",shopEffect:"7,000,000 DAMAGE // 35% PARRY CHANCE"},
    {id:"xenith-01-world-weaver",name:"Xenith-01: The World Weaver",rarity:"KISHIN // WORLD WEAVER",color:"#6cf6ff",image:"assets/Xenith-01 The World Weaver.png",cost:"25000000000000",bio:"Xenith-01 weaves reality into a colossal beam. It can also convert the stolen energy into a massive heal for its owner.",shopEffect:"12,000,000 DAMAGE // 45% HEAL CHANCE"},
    {id:"lord-zephyrus-ivory-overlord",name:"Lord Zephyrus, the Ivory Overlord",rarity:"KISHIN // IVORY OVERLORD",color:"#fff3c4",image:"assets/Lord Zephyrus, the Ivory Overlord.png",cost:"100000000000000",bio:"The private crown jewel of Helmet's stock. Zephyrus brings a catastrophic ivory execution built for hunters with truly absurd DOX.",shopEffect:"30,000,000 DAMAGE // IVORY OVERLORD EXECUTION"},
    {id:"henmercy",name:"Henmercy",rarity:"OFF-SALE // GOLDEN MERCY",offSale:true,color:"#ffd45a",image:"assets/Henmercy.png",cost:"500000",bio:"A golden apparition with four battle techniques: restore your HP, gamble with Cards Wish, hide behind Nornos Mask, or call down a 200,000-damage golden omen.",shopEffect:"4 UNIQUE SKILLS // FULL HEAL // CARDS WISH // GOLDEN CROSSES // OFF-SALE"},
    {id:"starlylands",name:"StarlyLands",rarity:"OFF-SALE // FALLEN CONSTELLATION",offSale:true,color:"#63caff",image:"assets/StarlyLands.png",cost:"100000000000000000",bio:"A billion-HP star sovereign with eight devastating techniques. Rain blue stars across the arena, judge the fallen, and decide who receives Mercy.",shopEffect:"1,000,000,000 HP // 8 UNIQUE SKILLS // BLUE STARFALL // OFF-SALE",skillIds:["starly-hearts-of-fallen","starly-judge-stars-of-fallen","starly-mercy","starly-comet-of-last-light","starly-blue-star-deluge","starly-astral-collapse","starly-fallen-constellation","starly-event-horizon"]},
    {id:"sea-predator-kishin",name:"Sea Predator",rarity:"KISHIN // ABYSSAL PREDATOR",color:"#3be7dc",image:"assets/sea-predator.png",cost:"50000000000000000",bio:"Five Sea Predators fused into one abyssal Kishin. Its shell holds five times the vitality, and all seven signature attacks strike with fivefold force.",shopEffect:"2.5B RIVALS HP // 5X ATTACK DAMAGE // SEVEN ABYSSAL ATTACKS",skillIds:["sea-kishin-abyssal-trident","sea-kishin-leviathan-crash","sea-kishin-tidal-guillotine","sea-kishin-shell-judgment","sea-kishin-black-tide","sea-kishin-ocean-devourer","sea-kishin-co-op-trident"]},
    {id:"creation-of-suntour",name:"Creation of Suntour",rarity:"OFF-SALE // CREATION KISHIN",offSale:true,color:"#a6f5c2",image:"assets/Creation of suntour.png",cost:"999999999999999999999999999999",bio:"An off-sale Kishin owned by A-SHEN-TADES. Its five-billion-HP body can endure the Sea Predator, parry incoming attacks, and unleash a high-pressure memory trial.",shopEffect:"5B RIVALS HP // 40% PARRY // CREATION SEQUENCE TRIAL",skillIds:["suntour-creation-trial"]},
    {id:"unconscious-singer",name:"Unconscious Singer",rarity:"OFF-SALE // DISSONANT KISHIN",offSale:true,color:"#ff5375",image:"assets/Unconscious Singer.png",cost:"999999999999999999999999999999",bio:"A sleepless performer who turns every battle into a hostile encore. His eight attacks weaponize feedback, falling notes, stolen tempo, and a cage of descending guitar strings.",shopEffect:"8 ANNOYING ATTACKS // STRING CAGE LEAVES 1 HP // OFF-SALE",skillIds:["singer-guitar-strings","singer-feedback-howl","singer-dissonant-drop","singer-bone-rattle","singer-stolen-tempo","singer-phantom-note","singer-requiem-loop","singer-curtain-call"]},
    {id:"king-and-hell",name:"King&Hell",rarity:"OFF-SALE // HELL-KING KISHIN",offSale:true,color:"#ffb347",image:"assets/King&Hell.png",cost:"999999999999999999999999999999",bio:"A two-headed king of the underworld with twelve billion Rivals HP, a hide that shrugs off a third of incoming damage, and a 30% chance to bite back whenever an opponent lands a hit. Tades owns this off-sale Kishin and all nineteen of his brutal techniques.",shopEffect:"12B HP // 30% DAMAGE RESISTANCE // 30% BITE-BACK CHANCE // 19 UNIQUE VFX SKILLS // OFF-SALE",skillIds:["king-hell-royal-maw","king-hell-fang-storm","king-hell-hellfire-snap","king-hell-thronefall","king-hell-chain-rake","king-hell-blacktongue","king-hell-grave-howl","king-hell-shadow-pounce","king-hell-ironhide","king-hell-feast-eternal","king-hell-blood-tax","king-hell-coffin-bite","king-hell-devour-moon","king-hell-bone-wheel","king-hell-crown-of-teeth","king-hell-hellgate-crush","king-hell-royal-guard","king-hell-pack-hunt","king-hell-endless-maw"]},
    {id:"oculumbra",name:"Oculumbra",rarity:"OFF-SALE // THE SCREAMING KISHIN",offSale:true,color:"#d9c6ff",image:"assets/Oculumbra.png",cost:"999999999999999999999999999999",bio:"Helmet's last off-sale horror: a two-quadrillion-HP nightmare with six devastating techniques. Her Wailing Cathedral deals colossal damage but always leaves its target standing; Oculumbra also has a 45% chance to parry an incoming hit and reflect it back.",shopEffect:"2 QUADRILLION RIVALS HP // 45% PARRY // 2X NONLETHAL REFLECTION // 6 HORROR SKILLS // OFF-SALE",skillIds:["oculumbra-wailing-cathedral","oculumbra-deadlight-gaze","oculumbra-grave-dance","oculumbra-black-veil","oculumbra-grasping-choir","oculumbra-scream-of-last-light"]}
  ]
};
window.YEN_HELMET.lines = window.YEN_HELMET.lines.map(line => line.replace("[PLAYER]", "${PLAYER}"));
