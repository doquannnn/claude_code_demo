const WINNING_LINES = [];
const N = 18, K = 5;
for (let r = 0; r < N; r++)
  for (let c = 0; c <= N - K; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => r * N + c + k));         // rows
for (let c = 0; c < N; c++)
  for (let r = 0; r <= N - K; r++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + c));       // cols
for (let r = 0; r <= N - K; r++)
  for (let c = 0; c <= N - K; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + (c + k))); // diag \
for (let r = 0; r <= N - K; r++)
  for (let c = K - 1; c < N; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + (c - k))); // diag /

function createGame() {
  return { board: Array(324).fill(null), currentPlayer: 'X', winner: null, isDraw: false };
}

function checkWinner(board) {
  for (const line of WINNING_LINES) {
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first)) {
      return first;
    }
  }
  return null;
}

function makeMove(state, index) {
  if (state.winner || state.isDraw) return state;
  if (state.board[index] !== null) return state;

  const board = state.board.slice();
  board[index] = state.currentPlayer;

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);
  const currentPlayer = winner || isDraw ? state.currentPlayer : (state.currentPlayer === 'X' ? 'O' : 'X');

  return { board, currentPlayer, winner, isDraw };
}

export { createGame, makeMove, checkWinner };
