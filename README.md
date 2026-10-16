# YEN! // BOSS WORLD

## Static GitHub build

This version does **not** use Render, a mini-server, SQLite, or `game-server/`.

The site is a static GitHub Pages project. Accounts are defined manually in `accounts.js`.

## Account editing

Open `accounts.js` and add/edit objects inside `window.YEN_ACCOUNTS`.

```js
{
  username: "player",
  password: "password",
  dox: "500000",
  ownedSkills: ["15", "Astral Nova 001"],
  attacks: [
    {
      id: "my-attack",
      name: "MY ATTACK",
      power: 90000,
      rarity: "CUSTOM",
      color: "#ff355e",
      description: "My custom account attack."
    }
  ],
  potions: {
    minor: 2,
    soul: 1
  }
}
```

`dox` may be a quoted number for extremely large balances so JavaScript does not round it.

## Boss separation

Each boss has its own script:

- `bosses/korthas.js` — Korthas phase two, trident skill destruction, Finish Him, Empress.
- `bosses/argus.js` — shield, parry, reload, rapid blast and healing.
- `bosses/azael.js` — Judgment Game, Tears, Domain and five Domain-only attacks.

The shared `script.js` is only the battle/UI engine. Boss-specific behavior belongs in the boss file.

## Azael

- 150 ★
- 2,300,000 HP
- 25,000,000 DOX reward
- Judgment Game: failure deals heavy damage; success gives one free attack while Azael is stunned.
- Tears: heavy damage.
- Domain: 10% chance, black transition, deep-red UI and `assets/domain-background.svg` for 4 minutes.
- Five additional Domain attacks are available to Azael during Domain.

## Merchant

- 8,000 skills total.
- 4,000 are Enchanted endgame skills with huge power and expensive DOX costs.
- Healing potions are available in the vault.
- Owned skills from `accounts.js` automatically become battle buttons.
- Custom account attacks from `accounts.js` automatically become battle buttons.

## Victory / defeat

Winning a boss shows the full-screen **VICTORIOUS!** sequence with an animated DOX counter, then returns to the lobby.

Losing shows the defeat sequence with retry/lobby controls.

## Character art

Character images are forced to remain fully visible. A missing image no longer changes its opacity to a faded state.
