/* YEN! // THE VASE GATE EVENT
   This is an event card, not a boss battle. Clicking it randomly chooses a Kishin. */
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_VASE_GATE = {
  rareOneId:"angelic-horror",
  rareTwoId:"souls-gate",
  rareOneChance:2,
  rareTwoChance:2,
  commonTargets:["korthas","argus","azael","malakor","aethelgard","amias","nebula","sea-predator"],
  background:"assets/vase-gate-background.svg"
};
window.YEN_BOSSES["vase-gate-event"]={
  id:"vase-gate-event",isVaseGateEvent:true,name:"THE VASE GATE EVENT",stars:0,
  title:"RANDOM KISHIN // 2% FOR TWO FORBIDDEN TARGETS",
  eventChanceText:"96% COMMON KISHIN // 2% ANGELIC'S HORROR // 2% SOUL'S GATE",
  cardImage:"assets/vase-gate-background.svg",profileFrame:"assets/vase-gate-card-frame.svg"
};
