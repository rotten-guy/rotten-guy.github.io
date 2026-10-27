<div align="center">

# 🌌 rotten_portfolio

**A neon cyan / magenta portfolio, set against a nebula.**

*Plain HTML · CSS · JS · no framework, no build step · GitHub Pages*

**[pourriture.github.io](https://pourriture.github.io)**

</div>

---

![Portfolio preview](assets/img/preview.webp)

---

## ✨ Features

| | Component | Details |
|---|---|---|
| 🖥️ | **Serpantinum-style top bar** | Sections are workspaces `1 … 5`: click them or press the number keys; the active one lights up magenta. Live clock in the center, like the real bar |
| 🔐 | **Greeter-style hero** | The name is drawn like the `nebula` SDDM clock: cyan line, magenta line, neon glow, a flicker now and then |
| 🐱 | **kitty + fastfetch card** | Arch logo in magenta, colored keys, palette dots and a starship prompt that types real commands |
| 🌈 | **Animated borders** | The Hyprland border: cyan → magenta gradient rotating at a constant speed, fading in when a card gets focus or the mouse |
| ⌨️ | **`SUPER + K` menu** | Press `K` anywhere: a fuzzel-like menu to jump to a section, a project or a link (`↑ ↓`, `Enter`, `Esc`) |
| 🗂️ | **Project windows** | Each project is a window with a screenshot gallery (tabs + lightbox), features, stats and tags. Filter: all / personal / academic |
| 🧩 | **Keycap skills** | Skills are drawn like the shortcut cheatsheet keys; typing a letter presses the matching keycaps |
| 🌌 | **Starfield** | Twinkling stars on a canvas, with a few cyan and magenta ones, over slowly drifting nebula clouds |
| 📜 | **`git log` history** | Timeline with real commit hashes from the projects |
| 📱 | **Responsive** | Works from 320 px wide; animations off with `prefers-reduced-motion` |
| 🚫 | **404 page** | `hyprctl dispatch workspace 404` |

---

## 🗂️ Projects shown

| Project | Kind | Stack |
|---|---|---|
| [**rotten_dotfiles**](https://github.com/PoUrRiTuRe/dotfiles) | Personal | Arch Linux, Hyprland (Lua), Bash, Python, QML, systemd, PAM, PipeWire |
| [**rotten Lily58**](https://github.com/PoUrRiTuRe/rotten_lily58_keymap_config) | Personal | C, Zephyr RTOS, ZMK, Devicetree, Python, GitHub Actions |
| [**SAE 2.03 · Covoit**](https://github.com/PoUrRiTuRe/SAE_2-03) | Academic (BUT R&T) | PHP, MySQL, PDO, HTML / CSS / JS, Apache |
| Write-ups | Personal | ZMK dongle, IKEv2 VPN, tablet as a monitor, Arch notes (in the dotfiles `docs/`) |

---

## 🎨 Palette

Same colors as the rice (see `assets/cheatsheet.html` in the dotfiles):

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#070914` | Background |
| `--cyan` | `#00f0ff` | Primary accent, links, keycaps |
| `--magenta` | `#e600ff` | Secondary accent, active workspace, link tables |
| `--text` | `#d6def5` | Body text |
| `--dim` | `#7d86a8` | Secondary text |
| `--card` | `rgba(18, 22, 46, .72)` | Translucent windows (blurred, like Hyprland) |

Fonts: **JetBrains Mono** (everything) and **Outfit** (neon titles, close to the greeter font), from Google Fonts.

---

## 📁 Repository layout

```
PoUrRiTuRe.github.io/
├── index.html                  # the whole site, one page, 5 "workspaces"
├── style.css                   # Nebula theme
├── script.js                   # starfield, clock, workspaces, SUPER + K menu, galleries
├── 404.html
├── .nojekyll                   # serve files as they are, no Jekyll
├── scripts/
│   └── make-schema.py          # draws assets/img/sae-schema.svg
└── assets/
    ├── icons/favicon.svg
    └── img/                    # screenshots (webp), keymap SVGs, screens GIF, preview + og image
```

---

## 🚀 Running locally

No build step: open `index.html`, or serve the folder so absolute paths in `404.html` work:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 🌐 Deploying

GitHub Pages serves the `main` branch root: *Settings* → *Pages* → *Deploy from a branch* → `main` / `/ (root)`. Every push to `main` is online a minute later at **https://pourriture.github.io**.

---

## 🔧 Editing

- **A project**: copy one `<article class="project win">` block in `index.html`. Gallery tabs take `data-src` / `data-alt`; the first tab must match the `<img>` below it.
- **Screenshots**: convert to WebP, ~1600 px wide (`convert in.png -resize 1600x -quality 82 out.webp`), into `assets/img/`.
- **SAE data model**: edit `TABLES` / `LINKS` in `scripts/make-schema.py`, then `python3 scripts/make-schema.py`.
- **`SUPER + K` entries**: the `items` list in `script.js`.
- **Skills**: `<span class="key">` (cyan) or `<span class="key super">` (magenta = daily use).
- **History**: `<li>` entries of `.log` in `index.html` (`merge` = magenta dot, `root` = yellow dot).
- **Preview images**: `assets/img/preview.webp` (1440 × 900) and `assets/img/og.png` (1200 × 630, link previews) are screenshots of the hero; retake them after a visual change.

---

## 🙏 Credits

- Screenshots and keymap pictures from [rotten_dotfiles](https://github.com/PoUrRiTuRe/dotfiles).
- Fonts: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) and [Outfit](https://fonts.google.com/specimen/Outfit) (SIL Open Font License).
- Built with the help of **[Claude](https://claude.ai)** (Anthropic), like the rice it shows off.
