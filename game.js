const N = 18, K = 5;

const WINNING_LINES = [];
for (let r = 0; r < N; r++)
  for (let c = 0; c <= N - K; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => r * N + c + k));
for (let c = 0; c < N; c++)
  for (let r = 0; r <= N - K; r++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + c));
for (let r = 0; r <= N - K; r++)
  for (let c = 0; c <= N - K; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + (c + k)));
for (let r = 0; r <= N - K; r++)
  for (let c = K - 1; c < N; c++)
    WINNING_LINES.push(Array.from({length: K}, (_, k) => (r + k) * N + (c - k)));

function createGame() {
  return { board: Array(324).fill(null), currentPlayer: 'X', winner: null, isDraw: false };
}

function checkWinner(board) {
  for (const line of WINNING_LINES) {
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first)) return first;
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

// Directions: [row-delta, col-delta]
const DIRS = [[0,1],[1,0],[1,1],[1,-1]];

// Scores for a run of N pieces (half-open); doubled when both ends are open
const SCORES = [0, 0, 2, 50, 1000, 100000];

function scoreFor(board, idx, player) {
  const r0 = (idx / N) | 0, c0 = idx % N;
  let total = 0;
  for (const [dr, dc] of DIRS) {
    let count = 1, openEnds = 0;
    // extend forward
    let r = r0 + dr, c = c0 + dc;
    while (r >= 0 && r < N && c >= 0 && c < N && board[r * N + c] === player) {
      count++; r += dr; c += dc;
    }
    const fwdOpen = (r >= 0 && r < N && c >= 0 && c < N && board[r * N + c] === null);
    if (fwdOpen) openEnds++;
    // extend backward
    r = r0 - dr; c = c0 - dc;
    while (r >= 0 && r < N && c >= 0 && c < N && board[r * N + c] === player) {
      count++; r -= dr; c -= dc;
    }
    const bwdOpen = (r >= 0 && r < N && c >= 0 && c < N && board[r * N + c] === null);
    if (bwdOpen) openEnds++;

    if (count >= K) { total += SCORES[K]; continue; }
    if (openEnds === 0) continue;
    const base = SCORES[count];
    total += openEnds === 2 ? base * 2 : base;
  }
  return total;
}

function aiMove(board) {
  const opponent = 'X';
  const self = 'O';
  const center = Math.floor(N / 2) * N + Math.floor(N / 2); // 9*18+9 = 171
  let bestScore = -1, bestIdx = center;

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;
    // Temporarily place piece to count consecutive runs
    board[i] = self;
    const offScore = scoreFor(board, i, self);
    board[i] = opponent;
    const defScore = scoreFor(board, i, opponent);
    board[i] = null;

    const score = Math.max(offScore, defScore);
    // Tie-break: prefer closer to center
    const distToCenter = Math.abs((i / N | 0) - Math.floor(N / 2)) + Math.abs(i % N - Math.floor(N / 2));
    if (score > bestScore || (score === bestScore && distToCenter < (Math.abs((bestIdx / N | 0) - Math.floor(N / 2)) + Math.abs(bestIdx % N - Math.floor(N / 2))))) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export { createGame, makeMove, checkWinner, aiMove };
