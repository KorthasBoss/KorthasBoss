# YEN! // BOSS WORLD

A static YEN! boss-hunting site. The game does **not** use Render, a mini-server,
SQLite, or a public account database.

## Accounts

Accounts are defined in `accounts.js` and loaded directly by username/password.
DOX, purchased skills, custom attacks and potion inventory are intentionally
session-only. If you want a player to start with more DOX or a new skill, edit
their object in `accounts.js`.

Example:

```js
{
  username: "playername",
  password: "choose-a-password",
  dox: 500000,
  ownedSkills: ["0", "1234"],
  attacks: [
    {
      id: "my-attack",
      name: "MY ATTACK",
      power: 42000,
      rarity: "CUSTOM",
      color: "#ff355e",
      description: "What this attack does."
    }
  ],
  potions: {
    minor: 2,
    royal: 1
  }
}
```

This is a trusted/private account system. Credentials are visible to anyone who
can inspect the GitHub Pages files. Do not reuse real passwords.

## Boss organization

Every boss is now separated into its own script:

```text
bosses/
├── korthas.js
├── argus.js
└── azael.js
```

`index.html` loads these scripts before `script.js`. This keeps each boss's large
configuration separate instead of piling every boss into the master script.

### Korthas

- 56 stars
- 700,000 HP
- Phase Two remains intact
- His Trident Arc visibly flies into the selected skill buttons
- Trident Arc can destroy basic attacks, purchased skills and custom account attacks
- Finish Him -> Empress remains intact
- Empress remains at 1,000,000 HP

### Argus

- 79 stars
- 2,000,000 HP
- 3,000 shield
- Gun parry/reload
- Rapid Blast
- Healing

### Azael

- 150 stars
- 2,300,000 HP
- 25,000,000 DOX reward
- Judgment Game: fail = heavy damage; win = Azael is stunned for one player turn
- Tears: heavy damage
- Domain: 10% chance to activate
- Domain fades the screen through black, switches the entire battle UI to deep red,
  and uses `assets/domain-background.svg`
- Domain lasts four minutes
- Domain unlocks five additional attacks
- Domain attacks are intentionally unpredictable

Azael's included `assets/azael.svg` is a working placeholder character. Replace
that file with your final Azael artwork whenever you have it; the filename can
stay the same.

## Merchant

The Merchant now has **8,000 skills** total:

- 4,000 standard skills across Common -> Mythic
- 4,000 **ENCHANTED** endgame skills
- Enchanted skills have much higher damage and extremely high DOX prices

The Merchant also sells five healing potions. Purchased potions appear as usable
buttons in battle and restore HP.

## Character fading fix

Character images are forced to remain at full opacity. Missing assets no longer
make the character fade to 15% opacity.

## Removed server files

The old `game-server/` folder and the unused server/database files have been
removed from this build. This version is intended to be a normal static GitHub
Pages site.
