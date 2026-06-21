# Tokens (Foundations)

The Gomoku design language is expressed entirely as CSS custom properties on
`:root`, defined in `tokens/tokens.css` and re-exported through `styles.css`.
Style with `var(--*)` — never hard-code hex, px, or font stacks.

## Color
| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#5a9e8a` | page / surface background (teal) |
| `--color-surface` | `#ffffff` | cards, empty board cells |
| `--color-surface-hover` | `#e8f5f1` | hovered empty cell |
| `--color-ink` | `#1a1a1a` | primary text, button fill, cell border |
| `--color-on-bg` | `#ffffff` | text/icons on `--color-bg` or `--color-ink` |
| `--color-player-x` | `#d64545` | player X (red) |
| `--color-player-o` | `#2f6fb3` | player O (blue) |
| `--color-win` | `#f4c430` | winning-line highlight (gold) |

## Typography
`--font-sans` (system stack) · sizes `--fs-sm` 1rem / `--fs-md` 1.2rem /
`--fs-lg` 2rem · `--fw-bold` 700 · `--tracking-wide` 0.05em.

## Spacing (4px base)
`--space-1` .25rem · `--space-2` .5rem · `--space-3` 1rem · `--space-4` 1.5rem ·
`--space-6` 2rem.

## Sizing · radius · elevation · motion
`--cell-size` 38px · `--board-cols` 18 · `--grid-gap` 2px ·
`--radius-sm` 4px / `--radius-md` 6px ·
`--shadow-1` (subtle) / `--shadow-2` (raised) · `--transition` 150ms ease.

## Example
```html
<div style="background: var(--color-bg); color: var(--color-on-bg);
            padding: var(--space-6); font-family: var(--font-sans);">
  <h1 style="font-size: var(--fs-lg); font-weight: var(--fw-bold);
             letter-spacing: var(--tracking-wide);">Gomoku — 5 in a Row</h1>
</div>
```
