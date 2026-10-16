/* YEN! // KORTHAS BOSS SCRIPT
   Everything unique to Korthas lives here: stats, attacks, phases,
   Finish Him -> Empress dialogue, rewards and battle asset references.
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
  attack: "assets/korthas-attack.png",
  music: "assets/korthas-theme.mp3",
  battleBackground: "assets/Background.gif",
  parrySound: "assets/perry.mp3",
  shield: 0,
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
  empress: [
    "You dare to hurt my husband in my own castle.",
    "I didn't know magnet's can go this low.",
    "Yet","Here you are.","I WILL","MAKE","SURE","YOU WIISH YOU NEVER DONE THIS"
  ]
};
