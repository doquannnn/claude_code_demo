# Status message (`.status`)

The single line above the board that reports whose turn it is, AI thinking, a
win, or a draw. Apply `.status` to a block element; reserves a `min-height` so
the layout doesn't jump as the text changes.

## Markup
```html
<div class="status">Player <b data-player="X">X</b>'s turn</div>
<div class="status">AI is thinking…</div>
<div class="status">Player <b data-player="O">O</b> wins!</div>
<div class="status">It's a draw!</div>
```

## Player coloring
Wrap the player letter in `<b data-player="X">` / `<b data-player="O">` to tint
it red / blue — the same `--color-player-*` tokens the cells use, so the player
identity reads consistently across the board and the status line.

## Notes
- One status line at a time; swap its text content, don't stack multiples.
- No size variants — it always renders at `--fs-md`.
