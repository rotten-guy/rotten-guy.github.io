# CLAUDE.md

Guidelines for AI-assisted changes to this repository. Read `README.md` first.

## Project

Personal portfolio of Joshua Gillet (`rotten_guy`, GitHub `rotten-guy`, formerly `PoUrRiTuRe`), served by GitHub Pages at https://rotten-guy.github.io from the `main` branch root. Its look copies the "Nebula" Hyprland rice of the [dotfiles](https://github.com/rotten-guy/dotfiles): night-blue background, cyan / magenta neon, JetBrains Mono.

## Conventions

1. **Everything committed is in English**: page text, code comments, commit messages. Communicate with the maintainer in French.
2. **No framework, no build step**: plain `index.html`, `style.css`, `script.js`. External resources only from Google Fonts.
3. **Nebula palette only**: use the CSS variables in `:root` (`--cyan`, `--magenta`, `--text`, `--dim`…), never new accent colors. New UI should look like a piece of the rice (top bar, greeter, kitty, fuzzel, cheatsheet keys).
4. **Facts only**: project descriptions, numbers and commit hashes come from the real repositories. No invented skills, levels, dates or experience.
5. **No private information**: no home address, phone number or private email.
6. **Images**: WebP for screenshots (~1600 px wide), SVG for diagrams. Generated pictures keep their generator next to them or in `scripts/`.
7. **Check before committing**: open the page at desktop and phone width (390 px), no horizontal scroll, no console errors, calm mode (`prefers-reduced-motion`, `html[data-motion="calm"]`) still readable and still typing.
8. After a change that affects the look, retake `assets/img/preview.webp` and `assets/img/og.png`, and update `README.md`.

## Workflow

- Changes on a feature branch, merged into `main` through a pull request; Pages redeploys on every push to `main`.
