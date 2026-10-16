/* YEN! // ARGUS BOSS SCRIPT
   Everything unique to Argus lives here: shield, parry, gunfire,
   reloads, Rapid Blast, healing and battle rewards.
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
  parryChance: .52,
  rapidBlastChance: .42,
  extraShotChance: .38,
  healChance: .20,

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

  bossAttacks: [
    ["HAND CANNON",15000,27000],
    ["BLACK ROUND",12000,24000],
    ["EXECUTION SHOT",18000,30000]
  ],

  intro: ["I have watched a thousand like you fall. You will be no different."],
  rapid: "That's all you got? Fuck it."
};
