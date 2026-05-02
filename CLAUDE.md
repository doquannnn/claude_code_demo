# Tic-Tac-Toe (Gomoku)

Browser-based 18×18 Gomoku game — first to 5 in a row wins. Zero dependencies, ES modules only.

## Files

| File            | Purpose                        |
|-----------------|--------------------------------|
| `game.js`       | Game logic                     |
| `index.html`    | UI                             |
| `game.test.js`  | Tests (plain Node.js)          |

## game.js exports

```js
function createGame()
// → { board: Array(324).fill(null), currentPlayer: 'X', winner: null, isDraw: false }
// board is a flat 18×18 array (index = row * 18 + col)

function makeMove(state, index)  // returns new state (immutable)

function checkWinner(board)      // returns 'X' | 'O' | null
```

Win condition: 5 consecutive pieces in any row, column, or diagonal.

## index.html

- Imports `game.js` as `<script type="module">`
- Renders an 18×18 grid; clicking a cell calls `makeMove()`
- Displays current player, winner, or draw message
- Has a "New Game" button

## game.test.js

- Plain Node.js — no test framework, uses `console.assert`
- Covers: initial state, valid move, immutability, player alternation, occupied-cell rejection, win detection (all directions), draw detection
- Exits `0` on pass, `1` on failure

Run with: `node game.test.js`

## Style rules

- No npm, no bundler, no external dependencies
- ES modules throughout
- Keep files around 80 lines

## CI/CD

- CI runs `node game.test.js` on every push and pull request via GitHub Actions
- CD deploys to GitHub Pages on every push to `main`
