import { createGame, makeMove, checkWinner } from './game.js';

let failed = 0;
function assert(condition, message) {
  if (!condition) { console.error('FAIL:', message); failed++; }
}

// helpers
function play(moves) {
  // moves: array of [index] alternating X/O from a fresh game
  return moves.reduce((s, i) => makeMove(s, i), createGame());
}
function interleave(xs, os) {
  // build move sequence: xs[0], os[0], xs[1], os[1], ... (X always goes first)
  const seq = [];
  const len = Math.max(xs.length, os.length);
  for (let i = 0; i < len; i++) {
    if (i < xs.length) seq.push(xs[i]);
    if (i < os.length) seq.push(os[i]);
  }
  return seq;
}

// 1. Initial state
const initial = createGame();
assert(initial.board.length === 324, 'board has 324 cells');
assert(initial.board.every(c => c === null), 'all cells start null');
assert(initial.currentPlayer === 'X', 'X goes first');
assert(initial.winner === null, 'no winner initially');
assert(initial.isDraw === false, 'no draw initially');

// 2. Valid move + immutability
const after = makeMove(initial, 4);
assert(after.board[4] === 'X', 'X placed at index 4');
assert(after.currentPlayer === 'O', 'player switches to O after move');
assert(initial.board[4] === null, 'original state not mutated');

// 3. Player alternation over several moves
let alt = createGame();
['X','O','X','O','X'].forEach((expected, i) => {
  assert(alt.currentPlayer === expected, `turn ${i} should be ${expected}`);
  alt = makeMove(alt, i * 2); // spread moves out to avoid adjacency
});

// 4. Taken-cell rejection
const taken = makeMove(makeMove(createGame(), 0), 0); // O tries cell already taken by X
assert(taken.board[0] === 'X', 'taken cell not overwritten');
assert(taken.currentPlayer === 'O', 'turn not advanced on rejected move');

// 5. checkWinner returns null on empty / partial board
assert(checkWinner(initial.board) === null, 'no winner on empty board');
assert(checkWinner(after.board) === null, 'no winner on partial board');

// 6. Horizontal win — X wins top row (indices 0–4)
const hWin = play(interleave([0,1,2,3,4], [18,19,20,21]));
assert(hWin.winner === 'X', 'horizontal: X wins row 0');
assert(checkWinner(hWin.board) === 'X', 'checkWinner confirms horizontal win');

// 7. Vertical win — X wins column 0 (indices 0,18,36,54,72)
const vWin = play(interleave([0,18,36,54,72], [1,2,3,4]));
assert(vWin.winner === 'X', 'vertical: X wins column 0');

// 8. Diagonal win (\) — X wins indices 0,19,38,57,76
const dWin = play(interleave([0,19,38,57,76], [1,2,3,4]));
assert(dWin.winner === 'X', 'diagonal (\\): X wins top-left to bottom-right');

// 9. Anti-diagonal win (/) — X wins indices 4,21,38,55,72
const aWin = play(interleave([4,21,38,55,72], [0,1,2,3]));
assert(aWin.winner === 'X', 'anti-diagonal (/): X wins top-right to bottom-left');

// 10. O can win too (X plays 5 scattered cells so it's O's turn for the 5th O move)
const oWin = play(interleave([50,100,150,200,250], [0,1,2,3,4]));
assert(oWin.winner === 'O', 'O can win with 5-in-a-row');

// 11. No move accepted after game ends
const locked = makeMove(hWin, 5);
assert(locked === hWin, 'state reference unchanged after post-win move attempt');

if (failed === 0) {
  console.log(`PASS (${11} test groups)`);
  process.exit(0);
} else {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
