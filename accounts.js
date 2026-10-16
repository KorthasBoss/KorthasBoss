/*
 * YEN! SCRIPT-DEFINED ACCOUNTS
 * Add one object per account below. You can also give an account starting potions with the optional `potions` object. This is a static/local account list:
 * anyone who can view the site files can read these credentials, so only use
 * this for a private/trusted deployment. Do not reuse real passwords.
 *
 * The game's 8 basic attacks (VOID SLASH, RUNE BURST, SOUL PIERCE, ECHO BOLT,
 * TOME SHARD, STARFALL, DREAD WAVE, LAST WORD) are automatically available to
 * every account. You do not need to list those basic attacks here.
 *
 * ownedSkills accepts either a skill ID (as a string, e.g. "0", "15") OR the
 * exact skill name shown in the Skill Vault. Names are matched case-insensitively.
 * This means you can write the skill's name instead of finding its ID.
 *
 * attacks adds extra custom attack buttons that are unique to this account.
 * Example:
 * {
 *   username: "argusfan",
 *   password: "change-me",
 *   dox: 2500000,
 *   ownedSkills: ["Void Slash 001", "Astral Nova 001", "15"],
 *   attacks: [
 *     { id: "dox-burst", name: "DOX BURST", power: 42000,
 *       rarity: "CUSTOM", color: "#ff355e",
 *       description: "A custom account-only attack." }
 *   ]
 * }
 */
window.YEN_ACCOUNTS = [
{
    username: "argusfan",
    password: "change-me",
    dox: 250000025000002500000250000025000002500000,
    ownedSkills: ["Void Slash 001", "Astral Nova 001", "15"],
    attacks: [
      { id: "dox-burst", name: "DOX BURST", power: 42000,
        rarity: "CUSTOM", color: "#ff355e",
        description: "A custom account-only attack." }
    ]
  }
];