# YEN! // BOSS WORLD

A customizable boss-hunting website built around the existing Korthas battle system.

## What is included

- YEN! start menu with Play / Settings / Credits
- Username + password account system
- 500,000 DOX starting bonus
- Server-side accounts for sign-in from other devices
- Boss lobby with Korthas (56★) and Argus (79★)
- Smooth black fade transitions between menus
- Boss confirmation screen before every fight
- Existing Korthas phases preserved, including Finish Him -> Empress
- Argus with shield, gun parry, reload, Rapid Blast, healing, and extra shots
- DOX rewards after boss clears
- Reward animation
- Merchant with 50 dialogue lines
- Procedural catalog of exactly 4,000 skills
- Rarity colors + Enchanted skills
- Purchased skills persist to the account and appear in every battle
- Settings for effects, music, and reduced motion
- Per-menu / per-boss / merchant background and music slots

## Custom assets

Drop these into `assets/` when you have them:

### Menu / lobby
- `menu-idle.png`
- `menu-background.jpg`
- `lobby-background.jpg`

### Korthas
- `korthas-idle.png`
- `korthas-fight.png`
- `korthas-defeat.png`
- `korthas-stage2.png`
- `korthas-attack.png`
- `korthas-lobby.jpg`
- `korthas-battle-background.jpg`
- `korthas-theme.mp3`

### Empress
- `empress.png`
- `empress-parry.mp3`

### Argus
- `argus-idle.png`
- `argus-fight.png`
- `argus-lobby.jpg`
- `argus-battle-background.jpg`
- `argus-theme.mp3`
- `argus-parry.mp3`
- `argus-reload.mp3`
- `argus-gun.png` (optional effect/projectile art)

### Merchant
- `merchant-idle.png`
- `merchant-background.jpg`
- `merchant-theme.mp3`

`background.gif` remains an optional arena fallback.

## Run YEN! on your mini server (local SQLite saves)

**Requirements:** Node.js 22.5 or newer.

1. Extract this folder to your computer.
2. Open a terminal in the `KorthasBoss-main` folder.
3. Run `npm install` once.
4. Run `npm start`.
5. Open `http://localhost:8080` in your browser.

The server creates `players.db` beside `server.js`. This SQLite file stores private accounts, password hashes, DOX, defeated-boss counts, and purchased skills. Keep this file and back it up; deleting it deletes the saved accounts. The old `data/accounts.json` is imported automatically the first time the new database is created, and the JSON file is left untouched. If a `players.db` from the previous mini server exists, its old `users` rows are imported into the new account table without deleting the old table.

To use the game from another device on the same Wi-Fi, open it using the computer running the server's local network IP, for example `http://192.168.1.25:8080`. Replace that example IP with the server computer's actual LAN IP and allow Node through the computer's firewall for private networks. The server must stay running. This is local-network access, not public internet hosting.

The game saves after purchases and boss rewards. If a server save fails, YEN! displays a warning instead of silently claiming the database was updated. Browser storage may hold a recovery copy, but it is not a replacement for the SQLite database.
