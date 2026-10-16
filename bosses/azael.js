/* YEN! // AZAEL BOSS SCRIPT
   Azael is deliberately self-contained. The normal encounter has three
   signature attacks. Domain mode adds five more attacks and lasts four minutes.
*/
window.YEN_BOSSES = window.YEN_BOSSES || {};
window.YEN_BOSSES.azael = {
  id: "azael",
  name: "AZAEL",
  stars: 150,
  title: "THE DOMAIN-BEARER",
  maxHP: 2300000,
  playerMaxHP: 180000,
  reward: 25000000,
  cardImage: "assets/Azael.png",
  idle: "assets/Azael.png",
  fight: "assets/azael.svg",
  music: "assets/korthas-theme.mp3",
  battleBackground: "assets/Background.gif",
  domainBackground: "assets/domain-background.svg",

  // Azael's three signature moves.
  miniGameAttack: {
    name: "JUDGMENT GAME",
    type: "minigame",
    failDamage: [65000, 90000],
    successText: "You break Azael's judgment. AZAEL IS STUNNED FOR ONE TURN."
  },
  tearsAttack: {
    name: "TEARS",
    type: "damage",
    damage: [48000, 78000],
    messages: [
      "Azael's tears hit the arena like acid.",
      "The tears burn through your soul.",
      "You feel the damage long after the impact."
    ]
  },
  domainAttack: {
    name: "DOMAIN",
    type: "domain",
    chance: .10
  },

  // Five extra attacks become available only while DOMAIN is active.
  domainAttacks: [
    { name:"RED HORIZON", min:30000, max:52000 },
    { name:"ABYSSAL DECREE", min:36000, max:60000 },
    { name:"CRIMSON FALL", min:28000, max:68000 },
    { name:"DOMAIN BREAKER", min:42000, max:72000 },
    { name:"AZAEL'S FINAL WORD", min:50000, max:85000 }
  ],

  intro: [
    "....",
    "So you finally found me.",
    "Do not mistake my silence for mercy."
  ],
  domainStart: [
    "AZAEL opens their domain.",
    "The world around you goes completely black.",
    "Something has changed."
  ],
  domainEnd: "The domain collapses. The world returns to normal.",
  rewardText: "AZAEL HAS FALLEN. THE DOMAIN-BEARER HAS BEEN DEFEATED."
};
