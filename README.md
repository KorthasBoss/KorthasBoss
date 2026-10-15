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

## Run locally

This version includes a tiny Express server because true cross-device accounts require a server. Install dependencies and run:

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

The server stores account data in `data/accounts.json`. Passwords are stored as salted scrypt hashes, not plain text.

### Deployment note

For a hosted deployment such as Render, keep `data/accounts.json` on persistent storage (for example a persistent disk). Without persistent storage, a server restart/redeploy can erase the local JSON account database.

If the HTML is opened directly as a file, the site has a localStorage fallback so the battle and menu can still be tested, but that fallback is not a cross-device account system.
