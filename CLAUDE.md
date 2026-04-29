# Tic-Tac-Toe — Multi-Agent Build

## Project goal
Build a minimal browser-based Tic-Tac-Toe game using 3 parallel agents.

## File structure
```
index.html   ← UI (Agent 2 owns this)
game.js      ← Game logic (Agent 1 owns this)
game.test.js ← Tests      (Agent 3 owns this)
```

## Contracts between files

### game.js must export
```js
// Returns fresh board state
function createGame()
// → { board: [null×9], currentPlayer: 'X', winner: null, isDraw: false }

// Returns new state after a move (immutable)
function makeMove(state, index)

// Returns 'X' | 'O' | null
function checkWinner(board)
```

### index.html must
- Import game.js as a module (`<script type="module">`)
- Render a 3×3 grid; clicking a cell calls makeMove()
- Show current player, winner, or draw message
- Include a "New game" button

### game.test.js must
- Use plain Node.js (no test framework, just console.assert)
- Import game.js and test: initial state, valid move, win detection, draw detection
- Exit with code 0 on pass, 1 on failure

## Style rules
- Zero dependencies (no npm, no bundler)
- ES modules only
- Keep each file under 80 lines
