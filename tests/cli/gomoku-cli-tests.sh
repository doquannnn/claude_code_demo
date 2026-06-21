#!/usr/bin/env bash
# Gomoku CLI tests using @playwright/cli
# Each test opens a fresh browser session, interacts via CLI commands,
# takes screenshots, and asserts DOM state with eval.

set -euo pipefail

PASS=0
FAIL=0
SCREENSHOTS_DIR="$(dirname "$0")/screenshots"
mkdir -p "$SCREENSHOTS_DIR"

# ── helpers ──────────────────────────────────────────────────────────────────

CLI="npx playwright-cli"
BASE_URL="http://localhost:3002"

pass() { echo "  ✓ $1"; PASS=$((PASS+1)); }
fail() { echo "  ✗ $1"; FAIL=$((FAIL+1)); }

# eval a JS expression and return raw value (strip surrounding JSON quotes)
peval() { $CLI eval "$1" --raw 2>/dev/null | sed 's/^"//;s/"$//'; }

assert_eq() {
  local label="$1" got="$2" want="$3"
  if [ "$got" = "$want" ]; then pass "$label"; else fail "$label (got='$got', want='$want')"; fi
}

# ── server lifecycle ──────────────────────────────────────────────────────────

echo "Starting local server on port 3002..."
npx serve . --listen 3002 --no-clipboard > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1  # let serve start

cleanup() {
  $CLI close 2>/dev/null || true
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

# ── test 1: page loads with correct title and board ──────────────────────────

echo ""
echo "Test 1 — Page loads correctly"
$CLI open "$BASE_URL" > /dev/null 2>&1

title=$(peval "document.title")
assert_eq "page title is 'Gomoku'" "$title" "Gomoku"

heading=$(peval "document.querySelector('h1').textContent")
assert_eq "h1 is 'Gomoku — 5 in a Row'" "$heading" "Gomoku — 5 in a Row"

cell_count=$(peval "document.querySelectorAll('.cell').length")
assert_eq "board has 324 cells (18×18)" "$cell_count" "324"

status=$(peval "document.querySelector('#status').textContent")
assert_eq "initial status is Player X's turn" "$status" "Player X's turn"

$CLI screenshot --filename "$SCREENSHOTS_DIR/01-page-load.png" > /dev/null 2>&1
echo "  → screenshot: screenshots/01-page-load.png"
$CLI close > /dev/null 2>&1

# ── test 2: clicking a cell places X and AI responds with O ──────────────────

echo ""
echo "Test 2 — Click places X, AI responds with O"
$CLI open "$BASE_URL" > /dev/null 2>&1

cell0=$(peval "(() => { document.querySelectorAll('.cell')[0].click(); return document.querySelectorAll('.cell')[0].textContent; })()")
assert_eq "cell 0 shows X after click" "$cell0" "X"

sleep 0.3  # allow AI 100ms timeout + buffer

o_count=$(peval "Array.from(document.querySelectorAll('.cell')).filter(c => c.textContent === 'O').length")
assert_eq "AI placed exactly 1 O on the board" "$o_count" "1"

status=$(peval "document.querySelector('#status').textContent")
assert_eq "status returns to Player X's turn" "$status" "Player X's turn"

$CLI screenshot --filename "$SCREENSHOTS_DIR/02-after-first-move.png" > /dev/null 2>&1
echo "  → screenshot: screenshots/02-after-first-move.png"
$CLI close > /dev/null 2>&1

# ── test 3: occupied cell cannot be overwritten ───────────────────────────────

echo ""
echo "Test 3 — Occupied cell cannot be overwritten"
$CLI open "$BASE_URL" > /dev/null 2>&1

peval "document.querySelectorAll('.cell')[0].click()" > /dev/null
sleep 0.3

# click the same cell again — should stay X, not flip to O or blank
peval "document.querySelectorAll('.cell')[0].click()" > /dev/null
sleep 0.15

cell0=$(peval "document.querySelectorAll('.cell')[0].textContent")
assert_eq "cell 0 still shows X after re-click" "$cell0" "X"

x_count=$(peval "Array.from(document.querySelectorAll('.cell')).filter(c => c.textContent === 'X').length")
assert_eq "exactly 1 X on board (no phantom moves)" "$x_count" "1"

$CLI screenshot --filename "$SCREENSHOTS_DIR/03-occupied-cell.png" > /dev/null 2>&1
echo "  → screenshot: screenshots/03-occupied-cell.png"
$CLI close > /dev/null 2>&1

# ── test 4: New Game button resets the board ─────────────────────────────────

echo ""
echo "Test 4 — New Game button resets board"
$CLI open "$BASE_URL" > /dev/null 2>&1

# make a move, wait for AI
peval "document.querySelectorAll('.cell')[10].click()" > /dev/null
sleep 0.3

taken_before=$(peval "document.querySelectorAll('.cell[data-taken]').length")
[ "$taken_before" -ge 2 ] && pass "board has moves before reset" || fail "board has moves before reset (got $taken_before)"

# click New Game
peval "document.getElementById('new-game').click()" > /dev/null
sleep 0.1

taken_after=$(peval "document.querySelectorAll('.cell[data-taken]').length")
assert_eq "all cells cleared after New Game" "$taken_after" "0"

status=$(peval "document.querySelector('#status').textContent")
assert_eq "status resets to Player X's turn" "$status" "Player X's turn"

$CLI screenshot --filename "$SCREENSHOTS_DIR/04-new-game.png" > /dev/null 2>&1
echo "  → screenshot: screenshots/04-new-game.png"
$CLI close > /dev/null 2>&1

# ── test 5: multiple moves — X and O counts stay in sync ─────────────────────

echo ""
echo "Test 5 — Multiple moves: X and O counts stay equal"
$CLI open "$BASE_URL" > /dev/null 2>&1

for idx in 0 18 36; do
  peval "document.querySelectorAll('.cell:not([data-taken])')[0].click()" > /dev/null
  sleep 0.35
done

x_count=$(peval "Array.from(document.querySelectorAll('.cell')).filter(c => c.textContent === 'X').length")
o_count=$(peval "Array.from(document.querySelectorAll('.cell')).filter(c => c.textContent === 'O').length")
assert_eq "3 X pieces on board" "$x_count" "3"
assert_eq "3 O pieces on board (AI matched each move)" "$o_count" "3"

$CLI screenshot --filename "$SCREENSHOTS_DIR/05-multiple-moves.png" > /dev/null 2>&1
echo "  → screenshot: screenshots/05-multiple-moves.png"
$CLI close > /dev/null 2>&1

# ── test 6: New Game button is always visible ─────────────────────────────────

echo ""
echo "Test 6 — New Game button is present and clickable"
$CLI open "$BASE_URL" > /dev/null 2>&1

btn=$(peval "document.getElementById('new-game').tagName")
assert_eq "New Game is a BUTTON element" "$btn" "BUTTON"

btn_text=$(peval "document.getElementById('new-game').textContent.trim()")
assert_eq "New Game button label" "$btn_text" "New Game"

$CLI close > /dev/null 2>&1

# ── summary ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────"
echo "Results: $PASS passed, $FAIL failed"
echo "────────────────────────────────"
[ "$FAIL" -eq 0 ]
