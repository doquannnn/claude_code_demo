# Gomoku Design System — conventions

A small **CSS + design-token** system (no React, no component runtime). You
build UI with plain HTML elements plus this system's CSS classes; the look comes
from CSS custom properties (design tokens). There is **no JS bundle and no
component props API** — style through classes, tokens, and a few `data-*`
attributes.

## Setup / wrapping
- Link the styling entry point once: `styles.css`. It `@import`s
  `tokens/tokens.css` (the `:root` tokens) and `_ds_bundle.css` (the component
  classes), so that single file gives you the whole design language.
- No provider/root wrapper is required. Tokens live on `:root`, so every element
  can read `var(--*)` immediately. For a full page, set the teal background and
  on-color yourself: `background: var(--color-bg); color: var(--color-on-bg);
  font-family: var(--font-sans);` (or apply the `.gomoku` helper class).

## Styling idiom — token-first CSS classes
- **Style via `var(--*)` tokens**, never hard-coded hex/px/font values. The full
  token list is in `tokens/tokens.css` and documented in the **Tokens** card.
- **Components are CSS classes**, with state from `data-*` attributes or `--`
  modifier classes. The complete, closed vocabulary:

| Class | What it is | State hooks |
|---|---|---|
| `.btn` | button (e.g. "New Game") | `:hover` / `.btn--hover`, `:active` / `.btn--active` |
| `.cell` | one board square (38px) | `data-player="X"\|"O"`, `data-taken`, `:hover:not([data-taken])` / `.cell--hover`, `.cell--win` |
| `.board` | 18×18 cell grid | — |
| `.status` | turn / win / draw line | child `<b data-player="X"\|"O">` for player color |
| `.gomoku` | page surface helper (bg + on-color + font) | — |

This vocabulary is **closed** — don't invent new classes or variants
(`.btn--primary`, `.cell--large`, …). If you need a one-off, compose with inline
token styles instead.

## Where the truth lives
- `styles.css` → `tokens/tokens.css` + `_ds_bundle.css` — read these before
  styling; they are the authoritative class and token definitions.
- Per-component usage: the `.prompt.md` next to each component card
  (`components/<group>/<Name>/`).

## Idiomatic snippet
```html
<div class="gomoku" style="padding: var(--space-6);">
  <h1 style="font-size: var(--fs-lg); font-weight: var(--fw-bold);
             letter-spacing: var(--tracking-wide);">Gomoku — 5 in a Row</h1>
  <div class="status">Player <b data-player="X">X</b>'s turn</div>
  <div class="board">
    <div class="cell" data-taken data-player="X">X</div>
    <div class="cell" data-taken data-player="O">O</div>
    <div class="cell"></div>
    <!-- … 324 cells total (18 × 18) … -->
  </div>
  <button class="btn">New Game</button>
</div>
```

---

## Components

| Group | Component | Class | Card |
|---|---|---|---|
| Foundations | Tokens | `:root` `var(--*)` | `components/Foundations/Tokens/Tokens.html` |
| Components | Button | `.btn` | `components/Components/Button/Button.html` |
| Components | Cell | `.cell` | `components/Components/Cell/Cell.html` |
| Components | Status | `.status` | `components/Components/Status/Status.html` |

Each component folder holds a standalone preview (`.html`, with a
`<!-- @dsCard group="…" -->` marker) and a usage reference (`.prompt.md`).

> Synced from the [`claude_code_demo`](https://github.com/doquannnn/claude_code_demo)
> repo's `design-system/` via the `/design-sync` skill (off-script CSS shape).
