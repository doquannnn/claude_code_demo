# Button (`.btn`)

The primary control, used in the product for the "New Game" button. Apply the
`.btn` class to a `<button>`. Dark ink fill on the teal surface, bold label,
raised shadow.

## Markup
```html
<button class="btn">New Game</button>
```

## States
- **Hover** — shadow lifts to `--shadow-2`. Real interaction uses `:hover`;
  use `.btn--hover` only to force the hover look in a static mockup.
- **Active/pressed** — nudges down 1px. `:active`, or force with `.btn--active`.

```html
<button class="btn btn--hover">New Game</button>   <!-- forced hover -->
<button class="btn btn--active">New Game</button>  <!-- forced pressed -->
```

## Notes
- All values are token-driven (`--space-*`, `--color-ink`, `--radius-md`,
  `--shadow-1/2`, `--transition`). Don't add inline colors or sizes.
- There is one button style. There are no size or color variants — keep it
  consistent; don't invent `.btn--primary` / `.btn--sm` etc.
