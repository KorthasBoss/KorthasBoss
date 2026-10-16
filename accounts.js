/*
==========================================================
 YEN! // ECHO ACCOUNT FILE
==========================================================
This is the ONLY place you need to edit accounts.

Every object inside YEN_ACCOUNTS is a complete account template.

Available fields:
  username       login name
  password       login password
  dox            starting DOX (number OR quoted number for huge values)
  ownedSkills   Skill IDs OR exact skill names from the 8,000-skill vault
  attacks       Extra attack buttons unique to this account
  potions       Starting healing-potion counts

The basic boss attacks are supplied by the boss's own script.
Purchased/owned skills and custom attacks are added automatically.

This is intentionally a static account system. There is no server and
nothing is saved back to this file automatically.

 {
        id: "dox-burst",
        name: "DOX BURST",
        power: 42000,
        rarity: "CUSTOM",
        color: "#ff355e",
        description: "A custom account-only attack."
      }
==========================================================
*/

window.YEN_ACCOUNTS = [
  {
    username: "Solstice",
    password: "666",
    // Quote enormous DOX values so JavaScript does not round them.
    dox: "2000000",
    // Add skill IDs (0-7999) or exact skill names.
    ownedSkills: [""],
    // Add as many account-only attack buttons as you want.
    attacks: [
    ],

    username: "kuya",
    password: "67",
    // Quote enormous DOX values so JavaScript does not round them.
    dox: "40000000",
    // Add skill IDs (0-7999) or exact skill names.
    ownedSkills: ["win-can-make-sword"],
    // Add as many account-only attack buttons as you want.
    attacks: [
    ],

    // Optional starting healing items.
    potions: {
      minor: 0,
      greater: 0
    }
  }

  // Add more accounts here:
  // ,{
  //   username: "anotherplayer",
  //   password: "password",
  //   dox: "500000",
  //   ownedSkills: ["15", "7999"],
  //   attacks: [
  //     { id:"my-attack", name:"MY ATTACK", power:90000, rarity:"CUSTOM", color:"#9b6cff", description:"My attack." }
  //   ],
  //   potions: { soul: 3 }
  // }
];
