# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

- **Remote**: https://github.com/doquannnn/claude_code_demo.git
- **Branch**: main
- **Commit Frequency**: Commit and push to GitHub regularly after completing meaningful work to preserve progress and maintain a clear work history
- **Commit Messages**: Use clean, descriptive commit messages in format `<type>: <description>` with Claude co-authorship attribution
  - Example types: `feat:` (new feature), `fix:` (bug fix), `refactor:` (code reorganization), `docs:` (documentation)
  - Always include co-author line: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **Push After Commits**: Always push commits to GitHub immediately after committing to ensure work is backed up and visible in the repository history

## Running the game

Open `index.html` directly in any browser — no build step, no server required. All code is self-contained in a single file.

If you need live-reload during development, use VS Code Live Server or:
```
python3 -m http.server 8080
```
then open `http://localhost:8080`.

## Architecture

Everything lives in `index.html` inside a single `<script>` block (~970 lines). Sections are delimited by banner comments and appear in this dependency order:

1. **Constants** — `LW = 320, LH = 240` (logical resolution; CSS scales the canvas up to fill the window with `image-rendering: pixelated`)
2. **Canvas setup** — single `<canvas>` element; `resize()` recalculates CSS size on window resize
3. **Audio** — zero-asset WebAudio oscillators; `tone(type, freq0, freq1, dur, vol)` is the primitive; `sfx.{shoot,hit,hurt,levelUp}` are the named effects
4. **Input** — `keys{}` (keydown/keyup), `mouse{x,y,down,clicked}` (coordinates are always in logical 320×240 space); `mouse.clicked` is a one-frame flag reset at the end of every `update()` call
5. **Sprite factory** — `oc(w, h, fn)` creates an offscreen canvas and returns it; all sprites (`PLAYER_FRAMES[4]`, `GUN_SPRITE`, `SPRITES{grunt,runner,tank,boss}`) are generated once at startup with `fillRect` calls — no image assets
6. **Level config** — `LEVELS[]` array of plain objects; each entry drives wave count, enemies per wave, spawn interval, allowed enemy types, boss flag, and background color
7. **Game state** — module-level `let` vars: `state` (string enum), `score`, `hi`, `lvlIdx`, `wavesLeft`, `waveTimer`, `transTimer`, `shakeTimer/X/Y`, `flashTimer`, and the four live arrays `enemies[]`, `bullets[]`, `particles[]` plus `player`
8. **Entity classes** — `Player`, `Enemy`, `Bullet`, `Particle`; each has `update(dt)`, `draw()`, and an `active` boolean; inactive entities are filtered out of their arrays at the end of each PLAYING frame
9. **Helpers** — `dist2(a,b)` (squared distance for collision), `spawnBlood()`, `edgeSpawn()`, `spawnWave()`, `startLevel(idx)`, `startGame()`
10. **Collision** — `collide()` runs circle-circle tests (bullet vs enemy, enemy vs player) using `dist2` against `(r1+r2)²`
11. **Draw helpers** — `drawBg()`, `drawHUD()`, `drawCrosshair()`
12. **Screen overlays** — `screenMenu()`, `screenGameOver()`, `screenLevelComplete()`, `screenWin()`
13. **Update** — `update(dt)` is a top-level `if/return` chain on `state`; the PLAYING branch runs entity updates, wave spawning, collision, and transition checks; `mouse.clicked` is always cleared at the end
14. **Render** — `render()` draws bg → particles → enemies → bullets → player (all inside a `ctx.save/translate(shakeX,shakeY)/restore`), then overlays HUD and state screens on top
15. **Game loop** — `requestAnimationFrame`; `dt` is capped at `0.05s` (50 ms) to prevent large timestep spikes on tab-switch

## Key conventions

- **Coordinate system**: all positions are in 320×240 logical pixels. Mouse events are converted to logical coords via `getBoundingClientRect()` and the current CSS scale.
- **Difficulty scaling**: `Enemy` constructor reads `lvlIdx` at spawn time and multiplies base HP by `1 + lvlIdx * 0.28` and base speed by `lvlIdx`-dependent offsets — no separate difficulty table.
- **Boss wave**: the final wave of any level with `boss: true` spawns a single `'boss'` enemy instead of the normal wave.
- **High score**: stored in `localStorage` under key `gunner_hi`; updated on game-over and win.
- **Adding a new enemy type**: add a `case` in `Enemy`'s constructor switch, draw its sprite via `oc()` in the SPRITES section, add death-particle colors to `spawnBlood`'s palette map, and add the type string to the relevant `LEVELS[].types` arrays.
- **Adding a new level**: append an object to `LEVELS[]` — the game auto-advances through the array and shows WIN after the last entry.
