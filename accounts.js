/*
 * YEN! SCRIPT-DEFINED ACCOUNTS
 * Add one object per account below. This is a static/local account list:
 * anyone who can view the site files can read these credentials, so only use
 * this for a private/trusted deployment. Do not reuse real passwords.
 *
 * ownedSkills: IDs from the skill catalog (strings, e.g. "0", "15").
 * attacks: extra account-only attack buttons. Each attack needs a unique id,
 * a name, and power. Optional: rarity, color, description.
 *
 * Example:
 * {
 *   username: "argusfan",
 *   password: "change-me",
 *   dox: 2500000,
 *   ownedSkills: ["0"],
 *   attacks: [
 *     { id: "dox-burst", name: "DOX BURST", power: 42000,
 *       rarity: "CUSTOM", color: "#ff355e",
 *       description: "A custom account-only attack." }
 *   ]
 * }
 */
window.YEN_ACCOUNTS = [
  {
    username: "PlayerOne",
    password: "change-this-password",
    dox: 500000,
    ownedSkills: ["0"],
    attacks: [
      {
        id: "dox-burst",
        name: "DOX BURST",
        power: 42000,
        rarity: "CUSTOM",
        color: "#ff355e",
        description: "A powerful custom attack."
      }
    ]
  },

  {
    username: "PlayerTwo",
    password: "another-password",
    dox: 2500000,
    ownedSkills: [],
    attacks: []
  }
];
