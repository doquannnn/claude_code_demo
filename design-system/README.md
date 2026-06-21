# Gomoku Design System

Local component library for the Gomoku game, ready to sync to a
claude.ai/design project with `/design-sync`.

Each preview is a standalone HTML file whose **first line** carries a
`<!-- @dsCard group="..." -->` marker. `design-sync` reads those markers to
build the card index in the Design System pane.

| File          | Group       | Shows                                   |
|---------------|-------------|-----------------------------------------|
| `tokens.html` | Foundations | Color palette, typography, spacing      |
| `buttons.html`| Components  | New Game button (default/hover/active)  |
| `cells.html`  | Components  | Board cell states (empty/X/O/win/hover) |
| `status.html` | Components  | Status messages (turn/thinking/win/draw)|

`tokens.css` holds the shared `:root` design tokens, mirroring the ones in
`../style.css` so previews render with the real design language.

## Usage

Run the `/design-sync` skill, pick (or create) a design-system project, and
sync components one at a time.
