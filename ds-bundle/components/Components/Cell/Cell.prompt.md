# Board Cell (`.cell`)

One square of the Gomoku board. White surface, ink border, fixed
`--cell-size` (38px) square. State is driven by **data attributes**, not extra
classes — this matches how the product renders the board.

## Markup
```html
<div class="cell"></div>                          <!-- empty -->
<div class="cell" data-taken data-player="X">X</div>  <!-- X placed (red) -->
<div class="cell" data-taken data-player="O">O</div>  <!-- O placed (blue) -->
```

## State vocabulary
| Selector | Effect |
|---|---|
| `data-player="X"` | text colored `--color-player-x` (red) |
| `data-player="O"` | text colored `--color-player-o` (blue) |
| `data-taken` | marks the cell occupied (cursor → default) |
| `:hover:not([data-taken])` | empty-cell hover → `--color-surface-hover` |
| `.cell--win` | gold `--color-win` background for a winning piece |
| `.cell--hover` | forces the hover look in a static mockup |

## Board layout
Arrange cells in an 18×18 grid with the `.board` class (uses `--board-cols`,
`--cell-size`, `--grid-gap`):
```html
<div class="board">
  <div class="cell"></div>
  <!-- … 324 cells (18 × 18) … -->
</div>
```

## Notes
- Always pair `data-taken` with `data-player` when a piece is placed.
- Color comes only from `data-player`; don't hard-code red/blue.
