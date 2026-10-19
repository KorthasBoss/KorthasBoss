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
    dox: "200087200",
    ownedSkills: ["win-can-make-sword"],
    attacks: [],
    potions: {
      minor: 0,
      greater: 0
    }
  },

  {
    username: "Kuya",
    password: "678",
    dox: "99999999999999999999",
    ownedSkills: ["win-can-make-sword", "trident-of-co-op"],
    attacks: [],
    potions: {
      minor: 0,
      greater: 0
    }
  }
];