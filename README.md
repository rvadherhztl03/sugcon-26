# Claude, Meet Sitecore — SUGCON India 2026 Deck

A presentation deck hosted on GitHub Pages. All slide content lives in a single JSON file, so updating the deck = editing one file.

## Quick deploy

1. Create a new GitHub repo (e.g. `sugcon-2026-deck`).
2. Upload all files from this folder to the repo root.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)` → Save.
4. Wait ~60 seconds. Your deck is live at `https://<username>.github.io/<repo-name>/`.

## Updating content

Edit `content.json`. That's it.

- Change speaker name, title, links → under `meta.speaker`
- Edit any slide → find it in the `slides` array and change the text
- Add a new slide → copy an existing slide block, paste, edit
- Reorder slides → just move the blocks in the array

Commit the change. GitHub Pages auto-deploys in about a minute.

## Controls

- **Right arrow / Space / PageDown**: Next slide
- **Left arrow / PageUp**: Previous slide
- **Home / End**: First / last slide
- **F**: Toggle fullscreen

## Slide types supported

| Type | Use for |
|---|---|
| `title` | Opening / title slide |
| `split` | Two-column comparison (good vs bad, etc.) |
| `chat` | Simulated Claude conversation with tool calls |
| `diagram` | Flow diagram with nodes + arrows + supporting cards |
| `architecture` | Numbered timeline of steps + cards |
| `tools` | Grid of tool names + descriptions |
| `cards` | Row of 3–4 cards (features, caveats, etc.) |
| `challenge` | CTA steps with time allocations |
| `closing` | Final slide with QR + contact columns |

## Theming

Edit `styles.css`. Top of the file has CSS variables for colors.

## Pre-event checklist

- [ ] Fill in speaker name, socials, QR code link in `content.json`
- [ ] Test full navigation on the actual presentation laptop
- [ ] Record backup video of all 14 slides
- [ ] Rehearse demos 3× the night before
- [ ] Pre-open Claude Desktop + Sitecore + Asana + Slack tabs

Good luck at SUGCON India 2026.
