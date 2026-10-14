# KORTHAS — Boss Encounter Website

A neat, customizable boss-fight website for GitHub Pages. You can add or replace the art, background, and music yourself without needing public image URLs.

## 1. The files you will edit most

- `index.html` — page structure and labels
- `style.css` — colors, layout, visual effects, button animations
- `script.js` — **all the easy-to-customize settings are at the very top**
- `assets/` — put your images, background, and music here

## 2. Add your art and music

Put your files in `assets/` and use these filenames:

| File | What it is |
|---|---|
| `korthas-idle.png` | Intro / idle character |
| `korthas-fight.png` | First-phase battle pose |
| `korthas-defeat.png` | Transformation dialogue pose |
| `korthas-stage2.png` | Stage-two pose |
| `korthas-attack.png` | Spear/projectile thrown at broken buttons |
| `background.gif` | Animated background (PNG/JPG also works if you change the path) |
| `korthas-theme.mp3` | Boss music |

**Important:** If you want different filenames, open `script.js` and edit `CONFIG.assets`. To change the background filename, edit the first line `BACKGROUND_IMAGE` near the top of `script.js`.

Transparent PNG or WebP character art is recommended. Keep the background image behind the game UI, not baked into the character sprites.

## 3. Customize the fight

At the top of `script.js`, change:
- `bossMaxHP` — boss HP (default 700000)
- `playerMaxHP` — player HP (default 180000)
- `phaseTwoAtHP` — phase-two trigger (default 610000)
- `introLines`, `yesLines`, `phaseTwoLines`, `phaseTwoFinalLine` — dialogue
- `playerAttacks` — names, random damage ranges, and random attack messages
- `bossAttacks` — boss attack names, damage ranges, and messages

The boss randomly destroys three different player attack buttons when phase two begins. The remaining buttons reorganize themselves automatically.

## 4. Test the website

Open `index.html` in a browser. For best results, use VS Code with the Live Server extension. Audio normally starts only after clicking YES because browsers block autoplay before a user interaction.

If an image does not show, check its exact spelling and file extension. Filenames are case-sensitive on GitHub Pages.

## 5. Publish on GitHub Pages

1. Create a new repository on GitHub.
2. Upload the contents of this folder, including the `assets` folder.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select your `main` branch and `/(root)`, then save.
5. Wait for GitHub Pages to publish.

Browsers usually block `window.close()` for tabs opened directly by a user. The `GET OUT` static sequence still plays; the site then attempts to close the tab.
perry_sheild.web

 
    music: "assets/Boss_Start_Music.mp3"