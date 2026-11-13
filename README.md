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


## Public Rivals // Render Web Service

This update adds Socket.IO room matchmaking while keeping the existing `accounts.js` sign-in flow. Players do not create accounts. The browser sends the username from the already signed-in local account to the room service; the server checks that the username exists in `accounts.js`, and eligible Kishins are checked against the current account's `ownedSkills` in the browser.

### Deploy on Render

1. Push this folder's contents to your GitHub repository (the folder containing `package.json`, `server.js`, and `index.html` must be the service root).
2. In Render choose **New + → Web Service** and connect that repository.
3. Set **Root Directory** to `KorthasBoss-main` only if the repository contains the outer ZIP-extracted folder. If you upload the contents of this folder as the repository root, leave Root Directory blank.
4. Runtime: Node. Build Command: `npm install`. Start Command: `npm start`.
5. Create the service. Render supplies `PORT` automatically. Do not use a Static Site for Public Rivals; Socket.IO requires a running Web Service.
6. Open the Render `onrender.com` URL. Both players must use that same URL. Test `/health`; it should return `{"ok":true,"service":"yen-public-rivals"}`.

### Important account limitation

`accounts.js` remains the existing client-side account list and is not migrated. This preserves the current login behavior, but client-side passwords, DOX, and ownership are visible/editable by anyone who can inspect the site. The room server can coordinate turns and room state, but it cannot securely authenticate those static accounts or prevent a modified browser from claiming a Kishin. Secure anti-cheat would require server-side account verification, which this update intentionally does not introduce.

### Public Rivals rules in this build

- Room codes are randomly generated for each new room.
- A room accepts two different usernames.
- Players can choose only owned Helmet Kishins shown by their local account.
- Kishin HP becomes the fighter's HP; only that Kishin's attacks are available.
- Four-second countdown, alternating turns, and server-broadcast damage.
- JorkaPrime has three separate attacks; its supplied voice lines play with their respective attacks.
- JorkaPrime and K,Z,X are marked OFF-SALE in Helmet's shop.

For local testing: `npm install` then `npm start`, then open `http://localhost:3000` in two browser windows.


A-SHEN-TADES ownership: when an existing `accounts.js` entry signs in with username `A-SHEN-TADES`, the client automatically adds `jorkaprime` to that session account. The supplied `accounts.js` in this ZIP did not contain an A-SHEN-TADES entry, so add that account using your existing private credentials if it is not already in your live repository; this update does not invent a password or create a new account.
