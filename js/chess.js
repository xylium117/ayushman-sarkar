/**
 * Terminal Cyber Chess Game
 * High-performance, robust Chess engine with 3 AI levels, 3 Timers,
 * full legal move validation, Castling, Promotion, and Cyber Noir UI.
 */

class TerminalChessGame {
  constructor(terminalInstance, targetContainer) {
    this.terminal = terminalInstance;
    this.container = targetContainer;

    // Difficulty: 'easy' | 'medium' | 'hard'
    this.difficulty = localStorage.getItem("terminal_chess_diff") || "medium";

    // Timer modes: '3m' (Blitz) | '5m' (Rapid) | 'infinite' (Untimed)
    this.timerMode = localStorage.getItem("terminal_chess_timer") || "5m";

    // Board: 8x8 grid.
    // 'wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK' or null
    this.board = [];
    this.turn = "w"; // 'w' = player, 'b' = AI
    this.selectedSquare = null;
    this.validMoves = [];
    this.moveHistory = [];
    this.capturedPieces = { w: [], b: [] };
    this.lastMove = null;
    this.inCheck = false;
    this.gameOver = false;
    this.gameResult = "";

    // Castling state
    this.castling = {
      w: { k: true, q: true },
      b: { k: true, q: true }
    };

    // Clocks
    this.initialTimes = {
      "3m": 180,
      "5m": 300,
      "infinite": 0
    };
    this.timeLeft = {
      w: this.initialTimes[this.timerMode],
      b: this.initialTimes[this.timerMode]
    };
    this.timerInterval = null;

    // AI Positional Heuristics
    this.pieceValues = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000
    };

    this.pawnPST = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    this.knightPST = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    this.initBoard();
    this.initDOM();
    this.startTimer();
  }

  initBoard() {
    this.board = [
      ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
      ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
      ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
    ];
  }

  initDOM() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "chess-game-wrapper";

    this.wrapper.innerHTML = `
      <div class="chess-header">
        <div class="chess-title">
          <span class="chess-icon"><i class="fa-solid fa-chess"></i></span>
          <span>CYBER-CHESS // AI v3.0</span>
        </div>
        
        <div class="chess-controls-row">
          <div class="chess-selector-group">
            <span class="chess-sel-label">DIFF:</span>
            <div class="chess-diff-selector">
              <button class="chess-sel-btn ${this.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">EASY</button>
              <button class="chess-sel-btn ${this.difficulty === 'medium' ? 'active' : ''}" data-diff="medium">MED</button>
              <button class="chess-sel-btn ${this.difficulty === 'hard' ? 'active' : ''}" data-diff="hard">HARD</button>
            </div>
          </div>

          <div class="chess-selector-group">
            <span class="chess-sel-label">TIME:</span>
            <div class="chess-timer-selector">
              <button class="chess-sel-btn ${this.timerMode === '3m' ? 'active' : ''}" data-timer="3m">3M</button>
              <button class="chess-sel-btn ${this.timerMode === '5m' ? 'active' : ''}" data-timer="5m">5M</button>
              <button class="chess-sel-btn ${this.timerMode === 'infinite' ? 'active' : ''}" data-timer="infinite">&infin;</button>
            </div>
          </div>
        </div>

        <button class="chess-exit-btn" title="Exit Game [ESC]" aria-label="Exit Game"><i class="fa-solid fa-xmark"></i> ESC</button>
      </div>

      <div class="chess-main-area">
        <!-- Left: Clocks, Board & Captured -->
        <div class="chess-board-col">
          <!-- Black (AI) Status Bar -->
          <div class="chess-player-hud black-hud">
            <div class="chess-hud-profile">
              <span class="chess-avatar-ai"><i class="fa-solid fa-robot"></i></span>
              <span class="chess-player-name">CYBER-BOT (<span id="chess-ai-diff-label">${this.difficulty.toUpperCase()}</span>)</span>
            </div>
            <div class="chess-captured-box" id="chess-black-captured"></div>
            <div class="chess-clock" id="chess-black-clock">${this.formatTime(this.timeLeft.b)}</div>
          </div>

          <!-- 8x8 Board Container -->
          <div class="chess-board-wrap">
            <div class="chess-board" id="chess-board-grid"></div>
          </div>

          <!-- White (Player) Status Bar -->
          <div class="chess-player-hud white-hud">
            <div class="chess-hud-profile">
              <span class="chess-avatar-user"><i class="fa-solid fa-user"></i></span>
              <span class="chess-player-name">YOU (WHITE)</span>
            </div>
            <div class="chess-captured-box" id="chess-white-captured"></div>
            <div class="chess-clock" id="chess-white-clock">${this.formatTime(this.timeLeft.w)}</div>
          </div>
        </div>

        <!-- Right: Move Log & Info Sidebar -->
        <div class="chess-sidebar-col">
          <div class="chess-status-badge" id="chess-status-banner">WHITE TO MOVE</div>
          <div class="chess-moves-container">
            <div class="chess-moves-header">MOVE HISTORY</div>
            <div class="chess-moves-list" id="chess-moves-log">
              <div class="chess-no-moves">Game started. Make your opening move!</div>
            </div>
          </div>
          <div class="chess-actions-bar">
            <button class="chess-action-btn" id="chess-newgame-btn"><i class="fa-solid fa-rotate-right"></i> NEW GAME</button>
            <button class="chess-action-btn" id="chess-resign-btn"><i class="fa-solid fa-flag"></i> RESIGN</button>
          </div>
        </div>
      </div>

      <div class="chess-footer">
        <span>Controls: <b>Click</b> piece to select &bull; <b>Click</b> highlighted square to move &bull; <b>[ESC]</b> Exit</span>
        <span id="chess-eval-tag">EVAL: <b>0.0</b></span>
      </div>
    `;

    this.container.appendChild(this.wrapper);
    this.bindDOMEvents();
    this.renderBoard();
  }

  bindDOMEvents() {
    // Difficulty Selector
    this.wrapper.querySelectorAll("[data-diff]").forEach(btn => {
      btn.addEventListener("click", () => {
        const diff = btn.getAttribute("data-diff");
        this.difficulty = diff;
        localStorage.setItem("terminal_chess_diff", diff);
        this.wrapper.querySelectorAll("[data-diff]").forEach(b => b.classList.toggle("active", b === btn));
        this.wrapper.querySelector("#chess-ai-diff-label").textContent = diff.toUpperCase();
        if (window.showToast) window.showToast(`<i class="fa-solid fa-chess"></i> Chess AI: ${diff.toUpperCase()}`);
      });
    });

    // Timer Selector
    this.wrapper.querySelectorAll("[data-timer]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-timer");
        this.timerMode = mode;
        localStorage.setItem("terminal_chess_timer", mode);
        this.wrapper.querySelectorAll("[data-timer]").forEach(b => b.classList.toggle("active", b === btn));
        this.restartGame();
      });
    });

    // Exit Button
    this.wrapper.querySelector(".chess-exit-btn").addEventListener("click", () => this.destroy());

    // New Game & Resign
    this.wrapper.querySelector("#chess-newgame-btn").addEventListener("click", () => this.restartGame());
    this.wrapper.querySelector("#chess-resign-btn").addEventListener("click", () => {
      if (!this.gameOver) {
        this.endGame("b", "You resigned. Black (AI) wins!");
      }
    });

    // Global Key ESC
    this.handleKeyDown = (e) => {
      if (e.key === "Escape") {
        this.destroy();
      }
    };
    window.addEventListener("keydown", this.handleKeyDown);
  }

  formatTime(seconds) {
    if (this.timerMode === "infinite") return "∞";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.timerMode === "infinite") return;

    this.timerInterval = setInterval(() => {
      if (this.gameOver) return;

      if (this.turn === "w") {
        this.timeLeft.w--;
        const clock = this.wrapper.querySelector("#chess-white-clock");
        if (clock) {
          clock.textContent = this.formatTime(this.timeLeft.w);
          if (this.timeLeft.w <= 30) clock.classList.add("low-time");
        }
        if (this.timeLeft.w <= 0) {
          this.endGame("b", "White ran out of time! Black wins.");
        }
      } else {
        this.timeLeft.b--;
        const clock = this.wrapper.querySelector("#chess-black-clock");
        if (clock) {
          clock.textContent = this.formatTime(this.timeLeft.b);
          if (this.timeLeft.b <= 30) clock.classList.add("low-time");
        }
        if (this.timeLeft.b <= 0) {
          this.endGame("w", "Black ran out of time! White wins.");
        }
      }
    }, 1000);
  }

  renderBoard() {
    const grid = this.wrapper.querySelector("#chess-board-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const pieceSymbols = {
      wP: "♙", wN: "♘", wB: "♗", wR: "♖", wQ: "♕", wK: "♔",
      bP: "♟", bN: "♞", bB: "♝", bR: "♜", bQ: "♛", bK: "♚"
    };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement("div");
        const isDark = (r + c) % 2 === 1;
        square.className = `chess-square ${isDark ? "dark-sq" : "light-sq"}`;
        square.dataset.row = r;
        square.dataset.col = c;

        // Selected square highlight
        if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
          square.classList.add("selected-sq");
        }

        // Last move highlight
        if (this.lastMove && ((this.lastMove.from.r === r && this.lastMove.from.c === c) ||
                             (this.lastMove.to.r === r && this.lastMove.to.c === c))) {
          square.classList.add("last-move-sq");
        }

        // Valid move hints (dots for empty squares, ring for captures)
        const isMoveTarget = this.validMoves.some(m => m.r === r && m.c === c);
        if (isMoveTarget) {
          if (this.board[r][c]) {
            square.classList.add("capture-target-sq");
          } else {
            const hint = document.createElement("div");
            hint.className = "chess-move-dot";
            square.appendChild(hint);
          }
        }

        // Check highlight on King
        const piece = this.board[r][c];
        if (piece && piece[1] === "K") {
          const color = piece[0];
          if (this.inCheck && this.turn === color) {
            square.classList.add("check-sq");
          }
        }

        // Piece rendering
        if (piece) {
          const pieceEl = document.createElement("span");
          pieceEl.className = `chess-piece ${piece[0] === "w" ? "white-piece" : "black-piece"}`;
          pieceEl.textContent = pieceSymbols[piece];
          square.appendChild(pieceEl);
        }

        // Click handler
        square.addEventListener("click", () => this.handleSquareClick(r, c));
        grid.appendChild(square);
      }
    }

    this.renderCaptured();
  }

  renderCaptured() {
    const pieceSymbols = {
      P: "♟", N: "♞", B: "♝", R: "♜", Q: "♛"
    };

    const whiteCapEl = this.wrapper.querySelector("#chess-white-captured");
    const blackCapEl = this.wrapper.querySelector("#chess-black-captured");

    if (whiteCapEl) {
      whiteCapEl.innerHTML = this.capturedPieces.w
        .map(p => `<span class="cap-piece white-cap">${pieceSymbols[p] || p}</span>`)
        .join("");
    }

    if (blackCapEl) {
      blackCapEl.innerHTML = this.capturedPieces.b
        .map(p => `<span class="cap-piece black-cap">${pieceSymbols[p] || p}</span>`)
        .join("");
    }
  }

  handleSquareClick(r, c) {
    if (this.gameOver || this.turn !== "w") return;

    const piece = this.board[r][c];

    // If destination square is among valid moves of currently selected piece
    if (this.selectedSquare && this.validMoves.some(m => m.r === r && m.c === c)) {
      const from = { r: this.selectedSquare.r, c: this.selectedSquare.c };
      this.selectedSquare = null;
      this.validMoves = [];
      this.executeMove(from, { r, c }, false);
      return;
    }

    // Select White piece
    if (piece && piece[0] === "w") {
      this.selectedSquare = { r, c };
      this.validMoves = this.getLegalMoves(this.board, r, c, "w");
      this.playBeep(420, 0.03, "sine");
      this.renderBoard();
    } else {
      this.selectedSquare = null;
      this.validMoves = [];
      this.renderBoard();
    }
  }

  executeMove(from, to, isAI = false) {
    const piece = this.board[from.r][from.c];
    if (!piece) return;

    const target = this.board[to.r][to.c];
    const isCapture = !!target;
    const movingColor = piece[0];

    // Track captured piece
    if (target) {
      const capColor = isAI ? "b" : "w";
      this.capturedPieces[capColor].push(target[1]);
      this.playBeep(260, 0.08, "sawtooth");
    } else {
      this.playBeep(isAI ? 480 : 540, 0.04, "triangle");
    }

    // Move piece on board
    this.board[to.r][to.c] = piece;
    this.board[from.r][from.c] = null;

    // Pawn Promotion (Auto-promote to Queen)
    if (piece[1] === "P") {
      if (piece[0] === "w" && to.r === 0) {
        this.board[to.r][to.c] = "wQ";
      } else if (piece[0] === "b" && to.r === 7) {
        this.board[to.r][to.c] = "bQ";
      }
    }

    // Castling rook move
    if (piece[1] === "K" && Math.abs(to.c - from.c) === 2) {
      if (to.c === 6) { // Kingside
        this.board[from.r][5] = this.board[from.r][7];
        this.board[from.r][7] = null;
      } else if (to.c === 2) { // Queenside
        this.board[from.r][3] = this.board[from.r][0];
        this.board[from.r][0] = null;
      }
    }

    // Update castling rights
    if (piece === "wK") this.castling.w = { k: false, q: false };
    if (piece === "bK") this.castling.b = { k: false, q: false };
    if (piece === "wR" && from.r === 7 && from.c === 0) this.castling.w.q = false;
    if (piece === "wR" && from.r === 7 && from.c === 7) this.castling.w.k = false;
    if (piece === "bR" && from.r === 0 && from.c === 0) this.castling.b.q = false;
    if (piece === "bR" && from.r === 0 && from.c === 7) this.castling.b.k = false;

    this.lastMove = { from, to, piece, isCapture };

    // Record Move in history
    const notation = this.getMoveNotation(piece, from, to, isCapture);
    this.recordMoveHistory(notation, movingColor);

    // Switch turn
    this.turn = this.turn === "w" ? "b" : "w";
    this.inCheck = this.isKingInCheck(this.board, this.turn);

    // Check for checkmate or stalemate
    const allNextMoves = this.getAllLegalMoves(this.board, this.turn);
    if (allNextMoves.length === 0) {
      if (this.inCheck) {
        const winner = this.turn === "w" ? "b" : "w";
        const msg = winner === "w" ? "CHECKMATE! You won against the AI!" : "CHECKMATE! Black (AI) won.";
        this.renderBoard();
        this.endGame(winner, msg);
      } else {
        this.renderBoard();
        this.endGame("draw", "STALEMATE! Game is drawn.");
      }
      return;
    }

    if (this.inCheck) {
      this.playBeep(750, 0.12, "sine");
      this.updateStatusBanner(`${this.turn === "w" ? "WHITE" : "BLACK"} IN CHECK!`, true);
    } else {
      this.updateStatusBanner(`${this.turn === "w" ? "WHITE" : "BLACK"} TO MOVE`);
    }

    // Update Evaluation
    this.updateEvaluation();

    // Re-render board immediately with new state
    this.renderBoard();

    // Trigger AI move if it's black's turn
    if (this.turn === "b" && !this.gameOver) {
      setTimeout(() => this.makeAIMove(), 280);
    }
  }

  getMoveNotation(piece, from, to, isCapture) {
    const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const pSymbol = piece[1] === "P" ? (isCapture ? cols[from.c] : "") : piece[1];
    const capSymbol = isCapture ? "x" : "";
    return `${pSymbol}${capSymbol}${cols[to.c]}${rows[to.r]}`;
  }

  recordMoveHistory(notation, movingColor) {
    const list = this.wrapper.querySelector("#chess-moves-log");
    if (!list) return;

    if (this.moveHistory.length === 0) {
      list.innerHTML = "";
    }

    this.moveHistory.push(notation);

    if (movingColor === "w") {
      // White move
      const moveNum = Math.ceil(this.moveHistory.length / 2);
      const row = document.createElement("div");
      row.className = "chess-move-row";
      row.innerHTML = `
        <span class="move-num">${moveNum}.</span>
        <span class="move-w">${notation}</span>
        <span class="move-b" id="move-b-${moveNum}">...</span>
      `;
      list.appendChild(row);
    } else {
      // Black move
      const moveNum = Math.floor(this.moveHistory.length / 2);
      const blackSpan = list.querySelector(`#move-b-${moveNum}`);
      if (blackSpan) {
        blackSpan.textContent = notation;
      }
    }

    list.scrollTop = list.scrollHeight;
  }

  updateStatusBanner(text, isAlert = false) {
    const banner = this.wrapper.querySelector("#chess-status-banner");
    if (banner) {
      banner.textContent = text;
      banner.className = `chess-status-badge ${isAlert ? "alert" : ""}`;
    }
  }

  updateEvaluation() {
    const evalTag = this.wrapper.querySelector("#chess-eval-tag");
    if (!evalTag) return;
    const score = (this.evaluateBoard(this.board) / 100).toFixed(1);
    const sign = score > 0 ? `+${score}` : `${score}`;
    evalTag.innerHTML = `EVAL: <b>${sign}</b>`;
  }

  // --- AI ENGINE (Minimax with Alpha-Beta Pruning) ---
  makeAIMove() {
    if (this.destroyed || this.gameOver || this.turn !== "b") return;

    const legalMoves = this.getAllLegalMoves(this.board, "b");
    if (legalMoves.length === 0) return;

    let selectedMove = null;

    if (this.difficulty === "easy") {
      // Easy: 65% random, 35% captures
      const captures = legalMoves.filter(m => this.board[m.to.r][m.to.c]);
      if (captures.length > 0 && Math.random() < 0.35) {
        selectedMove = captures[Math.floor(Math.random() * captures.length)];
      } else {
        selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }
    } else if (this.difficulty === "medium") {
      // Medium: Minimax depth 2
      selectedMove = this.getBestMoveMinimax(2);
    } else {
      // Hard: Minimax depth 3 with Alpha-Beta
      selectedMove = this.getBestMoveMinimax(3);
    }

    if (selectedMove) {
      this.executeMove(selectedMove.from, selectedMove.to, true);
    }
  }

  getBestMoveMinimax(depth) {
    let bestScore = -Infinity;
    let bestMoves = [];
    const moves = this.getAllLegalMoves(this.board, "b");

    moves.sort(() => Math.random() - 0.5);

    for (const move of moves) {
      const savedPiece = this.board[move.to.r][move.to.c];
      this.board[move.to.r][move.to.c] = this.board[move.from.r][move.from.c];
      this.board[move.from.r][move.from.c] = null;

      const score = -this.minimax(depth - 1, -Infinity, Infinity, false);

      this.board[move.from.r][move.from.c] = this.board[move.to.r][move.to.c];
      this.board[move.to.r][move.to.c] = savedPiece;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)] || moves[0];
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return this.evaluateBoard(this.board);
    }

    const turn = isMaximizing ? "b" : "w";
    const moves = this.getAllLegalMoves(this.board, turn);

    if (moves.length === 0) {
      if (this.isKingInCheck(this.board, turn)) {
        return isMaximizing ? -20000 : 20000;
      }
      return 0; // Stalemate
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const savedPiece = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = this.board[move.from.r][move.from.c];
        this.board[move.from.r][move.from.c] = null;

        const evalScore = this.minimax(depth - 1, alpha, beta, false);
        this.board[move.from.r][move.from.c] = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = savedPiece;

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const savedPiece = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = this.board[move.from.r][move.from.c];
        this.board[move.from.r][move.from.c] = null;

        const evalScore = this.minimax(depth - 1, alpha, beta, true);
        this.board[move.from.r][move.from.c] = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = savedPiece;

        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const color = piece[0];
        const type = piece[1].toLowerCase();
        let val = this.pieceValues[type] || 0;

        if (type === "p") {
          val += color === "w" ? this.pawnPST[r][c] : this.pawnPST[7 - r][c];
        } else if (type === "n") {
          val += color === "w" ? this.knightPST[r][c] : this.knightPST[7 - r][c];
        }

        if (color === "w") score += val;
        else score -= val;
      }
    }
    return score;
  }

  // --- NON-RECURSIVE THREAT DETECTION & LEGAL MOVE GENERATOR ---
  isSquareAttacked(board, targetR, targetC, attackerColor) {
    // 1. Pawns
    const pawnDir = attackerColor === "w" ? 1 : -1; // pawns move up for w, down for b. Attacking backwards from target
    const pawnRow = targetR + pawnDir;
    if (pawnRow >= 0 && pawnRow < 8) {
      if (targetC - 1 >= 0 && board[pawnRow][targetC - 1] === `${attackerColor}P`) return true;
      if (targetC + 1 < 8 && board[pawnRow][targetC + 1] === `${attackerColor}P`) return true;
    }

    // 2. Knights
    const kOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of kOffsets) {
      const nr = targetR + dr, nc = targetC + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (board[nr][nc] === `${attackerColor}N`) return true;
      }
    }

    // 3. Kings
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = targetR + dr, nc = targetC + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          if (board[nr][nc] === `${attackerColor}K`) return true;
        }
      }
    }

    // 4. Straight lines (Rooks & Queens)
    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
      let nr = targetR + dr, nc = targetC + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = board[nr][nc];
        if (p) {
          if (p[0] === attackerColor && (p[1] === "R" || p[1] === "Q")) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 5. Diagonals (Bishops & Queens)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = targetR + dr, nc = targetC + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = board[nr][nc];
        if (p) {
          if (p[0] === attackerColor && (p[1] === "B" || p[1] === "Q")) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    return false;
  }

  isKingInCheck(board, color) {
    let kingR = -1, kingC = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === `${color}K`) {
          kingR = r;
          kingC = c;
          break;
        }
      }
      if (kingR !== -1) break;
    }

    if (kingR === -1) return false;
    const enemyColor = color === "w" ? "b" : "w";
    return this.isSquareAttacked(board, kingR, kingC, enemyColor);
  }

  getAllLegalMoves(board, color) {
    const allMoves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece[0] === color) {
          const moves = this.getLegalMoves(board, r, c, color);
          moves.forEach(to => allMoves.push({ from: { r, c }, to }));
        }
      }
    }
    return allMoves;
  }

  getLegalMoves(board, r, c, color) {
    const rawMoves = this.getPseudoLegalMoves(board, r, c);
    return rawMoves.filter(to => {
      const savedPiece = board[to.r][to.c];
      board[to.r][to.c] = board[r][c];
      board[r][c] = null;

      const inCheck = this.isKingInCheck(board, color);

      board[r][c] = board[to.r][to.c];
      board[to.r][to.c] = savedPiece;

      return !inCheck;
    });
  }

  getPseudoLegalMoves(board, r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];

    const isEnemy = (tr, tc) => board[tr][tc] && board[tr][tc][0] !== color;
    const isEmpty = (tr, tc) => !board[tr][tc];

    // 1. PAWN
    if (type === "P") {
      const dir = color === "w" ? -1 : 1;
      const startRow = color === "w" ? 6 : 1;

      // 1 square forward
      if (r + dir >= 0 && r + dir < 8 && isEmpty(r + dir, c)) {
        moves.push({ r: r + dir, c });
        // 2 squares forward from starting rank
        if (r === startRow && isEmpty(r + dir * 2, c)) {
          moves.push({ r: r + dir * 2, c });
        }
      }

      // Diagonal captures
      [-1, 1].forEach(dc => {
        const tr = r + dir;
        const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          if (isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
        }
      });
    }

    // 2. KNIGHT
    if (type === "N") {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      offsets.forEach(([dr, dc]) => {
        const tr = r + dr;
        const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          if (isEmpty(tr, tc) || isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
        }
      });
    }

    // 3. BISHOP & QUEEN (Diagonals)
    if (type === "B" || type === "Q") {
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      dirs.forEach(([dr, dc]) => {
        let tr = r + dr;
        let tc = c + dc;
        while (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          if (isEmpty(tr, tc)) {
            moves.push({ r: tr, c: tc });
          } else {
            if (isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
            break;
          }
          tr += dr;
          tc += dc;
        }
      });
    }

    // 4. ROOK & QUEEN (Orthogonals)
    if (type === "R" || type === "Q") {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      dirs.forEach(([dr, dc]) => {
        let tr = r + dr;
        let tc = c + dc;
        while (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          if (isEmpty(tr, tc)) {
            moves.push({ r: tr, c: tc });
          } else {
            if (isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
            break;
          }
          tr += dr;
          tc += dc;
        }
      });
    }

    // 5. KING
    if (type === "K") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const tr = r + dr;
          const tc = c + dc;
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
            if (isEmpty(tr, tc) || isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
          }
        }
      }

      // Castling moves (Non-recursive check via isSquareAttacked)
      const rights = this.castling[color];
      const enemyColor = color === "w" ? "b" : "w";
      if (rights && !this.isSquareAttacked(board, r, c, enemyColor)) {
        // Kingside
        if (
          rights.k &&
          isEmpty(r, 5) &&
          isEmpty(r, 6) &&
          board[r][7] === `${color}R` &&
          !this.isSquareAttacked(board, r, 5, enemyColor)
        ) {
          moves.push({ r, c: 6 });
        }
        // Queenside
        if (
          rights.q &&
          isEmpty(r, 1) &&
          isEmpty(r, 2) &&
          isEmpty(r, 3) &&
          board[r][0] === `${color}R` &&
          !this.isSquareAttacked(board, r, 3, enemyColor)
        ) {
          moves.push({ r, c: 2 });
        }
      }
    }

    return moves;
  }

  endGame(winner, message) {
    this.gameOver = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.updateStatusBanner(message, true);

    if (winner === "w") {
      this.playVictorySound();
    } else {
      this.playDefeatSound();
    }

    if (window.showToast) {
      window.showToast(`<i class="fa-solid fa-chess"></i> ${message}`);
    }
  }

  restartGame() {
    this.initBoard();
    this.turn = "w";
    this.selectedSquare = null;
    this.validMoves = [];
    this.moveHistory = [];
    this.capturedPieces = { w: [], b: [] };
    this.lastMove = null;
    this.inCheck = false;
    this.gameOver = false;
    this.gameResult = "";
    this.castling = { w: { k: true, q: true }, b: { k: true, q: true } };

    this.timeLeft = {
      w: this.initialTimes[this.timerMode],
      b: this.initialTimes[this.timerMode]
    };

    const list = this.wrapper.querySelector("#chess-moves-log");
    if (list) list.innerHTML = `<div class="chess-no-moves">Game reset. Make your opening move!</div>`;

    this.updateStatusBanner("WHITE TO MOVE");
    this.renderBoard();
    this.startTimer();
  }

  playBeep(freq, duration, type = "sine") {
    if (this.destroyed) return;
    try {
      if (window.soundEngine && window.soundEngine.ctx && !window.soundEngine.muted) {
        window.soundEngine.resume();
        const ctx = window.soundEngine.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch (e) {}
  }

  playVictorySound() {
    if (this.destroyed) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => { if (!this.destroyed) this.playBeep(freq, 0.15, "triangle"); }, idx * 100);
    });
  }

  playDefeatSound() {
    if (this.destroyed) return;
    const notes = [440.00, 370.00, 311.13, 261.63];
    notes.forEach((freq, idx) => {
      setTimeout(() => { if (!this.destroyed) this.playBeep(freq, 0.18, "sawtooth"); }, idx * 120);
    });
  }

  destroy() {
    this.destroyed = true;
    this.gameOver = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;

    window.removeEventListener("keydown", this.handleKeyDown);

    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.remove();
    }

    if (this.terminal && this.terminal.activeGame === this) {
      this.terminal.activeGame = null;
    }
  }
}

window.TerminalChessGame = TerminalChessGame;
