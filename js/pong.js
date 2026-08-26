/**
 * Terminal Cyber Pong Game (Retro Arcade Pong with 3 Difficulties & High Score)
 * High-performance, responsive canvas game designed to fit cleanly inside the terminal buffer.
 */

class TerminalPongGame {
  constructor(terminalInstance, targetContainer) {
    this.terminal = terminalInstance;
    this.container = targetContainer;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.winner = null;

    // Difficulty Settings: 'easy' | 'medium' | 'hard'
    this.difficulty = localStorage.getItem("terminal_pong_diff") || "medium";
    this.bestRally = parseInt(localStorage.getItem("terminal_pong_best_rally") || "0", 10);

    this.playerScore = 0;
    this.cpuScore = 0;
    this.currentRally = 0;
    this.winningScore = 5;

    // Canvas Resolution - matching Dino Runner (600x140 for perfect terminal fit)
    this.width = 600;
    this.height = 140;

    // Game Config per Difficulty
    this.diffConfigs = {
      easy: {
        label: "EASY",
        playerH: 40,
        cpuH: 34,
        cpuSpeed: 2.8,
        cpuError: 14,
        ballSpeed: 4.6,
        speedInc: 0.2,
        maxBallSpeed: 8.2
      },
      medium: {
        label: "MEDIUM",
        playerH: 34,
        cpuH: 34,
        cpuSpeed: 4.2,
        cpuError: 6,
        ballSpeed: 5.4,
        speedInc: 0.28,
        maxBallSpeed: 10.8
      },
      hard: {
        label: "HARD",
        playerH: 30,
        cpuH: 38,
        cpuSpeed: 5.8,
        cpuError: 1.5,
        ballSpeed: 6.6,
        speedInc: 0.35,
        maxBallSpeed: 13.5
      }
    };

    // Entities
    this.player = {
      x: 14,
      y: 53,
      w: 8,
      h: 34,
      vy: 0,
      speed: 5.5,
      upPressed: false,
      downPressed: false
    };

    this.cpu = {
      x: 578,
      y: 53,
      w: 8,
      h: 34,
      vy: 0,
      targetY: 53
    };

    this.ball = {
      x: 300,
      y: 70,
      r: 4.5,
      vx: 0,
      vy: 0,
      speed: 5.4,
      trail: []
    };

    this.sparks = [];
    this.shakeAmount = 0;

    // Bound handlers
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleKeyUp = this.onKeyUp.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);

    this.initDOM();
    this.applyDifficulty(this.difficulty, false);
    this.resetBall(1);
    this.start();
  }

  initDOM() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "pong-game-wrapper";

    this.wrapper.innerHTML = `
      <div class="pong-header">
        <div class="pong-title">
          <span class="pong-icon"><i class="fa-solid fa-table-tennis-paddle-ball"></i></span>
          <span>CYBER-PONG // v2.0</span>
        </div>
        <div class="pong-diff-selector">
          <button class="pong-diff-btn ${this.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">EASY</button>
          <button class="pong-diff-btn ${this.difficulty === 'medium' ? 'active' : ''}" data-diff="medium">MEDIUM</button>
          <button class="pong-diff-btn ${this.difficulty === 'hard' ? 'active' : ''}" data-diff="hard">HARD</button>
        </div>
        <div class="pong-hud">
          <span class="pong-hi">HI <span id="pong-hi-val">${this.padScore(this.bestRally)}</span></span>
          <span class="pong-score"><span id="pong-p-score">00</span> : <span id="pong-c-score">00</span></span>
          <button class="pong-exit-btn" title="Exit Game [ESC]" aria-label="Exit Game"><i class="fa-solid fa-xmark"></i> ESC</button>
        </div>
      </div>
      <div class="pong-canvas-container">
        <canvas class="pong-canvas" width="600" height="140"></canvas>
        <div class="pong-mobile-controls">
          <button class="pong-ctrl-btn pong-btn-up">▲ UP</button>
          <button class="pong-ctrl-btn pong-btn-down">▼ DOWN</button>
        </div>
      </div>
      <div class="pong-footer">
        <span>Controls: <b>[W / S / ▲ / ▼ / MOUSE]</b> Move &bull; <b>[SPACE]</b> Pause &bull; <b>[1/2/3]</b> Diff &bull; <b>[ESC]</b> Exit</span>
        <span class="pong-rally-tag">RALLY: <b id="pong-rally-val">0</b></span>
      </div>
    `;

    this.container.appendChild(this.wrapper);
    this.canvas = this.wrapper.querySelector(".pong-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.pScoreEl = this.wrapper.querySelector("#pong-p-score");
    this.cScoreEl = this.wrapper.querySelector("#pong-c-score");
    this.hiValEl = this.wrapper.querySelector("#pong-hi-val");
    this.rallyValEl = this.wrapper.querySelector("#pong-rally-val");

    // Difficulty Buttons
    this.wrapper.querySelectorAll(".pong-diff-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const diff = btn.getAttribute("data-diff");
        this.applyDifficulty(diff);
      });
    });

    // Exit Button
    this.wrapper.querySelector(".pong-exit-btn").addEventListener("click", () => this.destroy());

    // Mobile Touch Controls
    const upBtn = this.wrapper.querySelector(".pong-btn-up");
    const downBtn = this.wrapper.querySelector(".pong-btn-down");

    upBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.player.upPressed = true; });
    upBtn.addEventListener("touchend", (e) => { e.preventDefault(); this.player.upPressed = false; });
    upBtn.addEventListener("mousedown", (e) => { e.preventDefault(); this.player.upPressed = true; });
    upBtn.addEventListener("mouseup", (e) => { e.preventDefault(); this.player.upPressed = false; });

    downBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.player.downPressed = true; });
    downBtn.addEventListener("touchend", (e) => { e.preventDefault(); this.player.downPressed = false; });
    downBtn.addEventListener("mousedown", (e) => { e.preventDefault(); this.player.downPressed = true; });
    downBtn.addEventListener("mouseup", (e) => { e.preventDefault(); this.player.downPressed = false; });

    // Mouse & Touch Tracking on Canvas
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.canvas.addEventListener("click", () => {
      if (this.gameOver) {
        this.restartGame();
      }
    });

    // Global Key Events
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  applyDifficulty(diff, notify = true) {
    if (!this.diffConfigs[diff]) diff = "medium";
    this.difficulty = diff;
    localStorage.setItem("terminal_pong_diff", diff);

    const cfg = this.diffConfigs[diff];
    this.player.h = cfg.playerH;
    this.cpu.h = cfg.cpuH;

    this.wrapper.querySelectorAll(".pong-diff-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-diff") === diff);
    });

    if (notify && window.showToast) {
      window.showToast(`<i class="fa-solid fa-table-tennis-paddle-ball"></i> Pong Difficulty: ${cfg.label}`);
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleY = this.height / rect.height;
    const mouseY = (e.clientY - rect.top) * scaleY;
    this.player.y = Math.max(3, Math.min(this.height - this.player.h - 3, mouseY - this.player.h / 2));
  }

  onTouchMove(e) {
    if (!e.touches.length) return;
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const scaleY = this.height / rect.height;
    const touchY = (e.touches[0].clientY - rect.top) * scaleY;
    this.player.y = Math.max(3, Math.min(this.height - this.player.h - 3, touchY - this.player.h / 2));
  }

  onKeyDown(e) {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      e.preventDefault();
      this.player.upPressed = true;
    } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      this.player.downPressed = true;
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (this.gameOver) {
        this.restartGame();
      } else {
        this.paused = !this.paused;
      }
    } else if (e.key === "1") {
      this.applyDifficulty("easy");
    } else if (e.key === "2") {
      this.applyDifficulty("medium");
    } else if (e.key === "3") {
      this.applyDifficulty("hard");
    } else if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
      e.preventDefault();
      this.destroy();
    }
  }

  onKeyUp(e) {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      this.player.upPressed = false;
    } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      this.player.downPressed = false;
    }
  }

  start() {
    this.running = true;
    this.loop();
  }

  restartGame() {
    this.playerScore = 0;
    this.cpuScore = 0;
    this.currentRally = 0;
    this.gameOver = false;
    this.winner = null;
    this.pScoreEl.textContent = "00";
    this.cScoreEl.textContent = "00";
    this.rallyValEl.textContent = "0";
    this.resetBall(1);
  }

  resetBall(servingDir = 1) {
    const cfg = this.diffConfigs[this.difficulty];
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.speed = cfg.ballSpeed;
    this.ball.trail = [];

    // Controlled initial angle: max ±25 degrees
    const angle = (Math.random() * 0.44 - 0.22) * Math.PI;
    this.ball.vx = Math.cos(angle) * this.ball.speed * servingDir;
    this.ball.vy = Math.sin(angle) * this.ball.speed;
  }

  update() {
    if (this.paused || this.gameOver) return;

    const cfg = this.diffConfigs[this.difficulty];

    // Player keyboard movement
    if (this.player.upPressed) {
      this.player.y -= this.player.speed;
    }
    if (this.player.downPressed) {
      this.player.y += this.player.speed;
    }
    this.player.y = Math.max(3, Math.min(this.height - this.player.h - 3, this.player.y));

    // CPU AI Movement
    const targetY = this.ball.vx > 0 ? this.ball.y : this.height / 2;
    const cpuCenter = this.cpu.y + this.cpu.h / 2;
    const diffY = targetY - cpuCenter;

    if (Math.abs(diffY) > cfg.cpuError) {
      if (diffY > 0) {
        this.cpu.y += Math.min(cfg.cpuSpeed, diffY);
      } else {
        this.cpu.y -= Math.min(cfg.cpuSpeed, -diffY);
      }
    }
    this.cpu.y = Math.max(3, Math.min(this.height - this.cpu.h - 3, this.cpu.y));

    // Ball movement & trail
    this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
    if (this.ball.trail.length > 6) this.ball.trail.shift();

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Top / Bottom Wall Bounce
    if (this.ball.y - this.ball.r <= 0) {
      this.ball.y = this.ball.r;
      this.ball.vy = Math.abs(this.ball.vy);
      this.spawnSparks(this.ball.x, this.ball.y, "#f59e0b", 5);
      this.playBeep(380, 0.03, "triangle");
    } else if (this.ball.y + this.ball.r >= this.height) {
      this.ball.y = this.height - this.ball.r;
      this.ball.vy = -Math.abs(this.ball.vy);
      this.spawnSparks(this.ball.x, this.ball.y, "#f59e0b", 5);
      this.playBeep(380, 0.03, "triangle");
    }

    // Player Paddle Collision (Left)
    // TWEAKED MECHANICS: Restrict maximum deflection angle to 42 degrees (0.73 rad)
    // to prevent steep vertical bouncing back-and-forth loops.
    if (
      this.ball.vx < 0 &&
      this.ball.x - this.ball.r <= this.player.x + this.player.w &&
      this.ball.x + this.ball.r >= this.player.x &&
      this.ball.y >= this.player.y - 2 &&
      this.ball.y <= this.player.y + this.player.h + 2
    ) {
      this.ball.x = this.player.x + this.player.w + this.ball.r;
      
      const relativeIntersectY = (this.ball.y - (this.player.y + this.player.h / 2)) / (this.player.h / 2);
      const clampedOffset = Math.max(-1, Math.min(1, relativeIntersectY));
      const maxBounceAngle = Math.PI / 4.2; // ~42.8 degrees max
      const bounceAngle = clampedOffset * maxBounceAngle;

      this.ball.speed = Math.min(cfg.maxBallSpeed, this.ball.speed + cfg.speedInc);
      this.ball.vx = Math.cos(bounceAngle) * this.ball.speed;
      this.ball.vy = Math.sin(bounceAngle) * this.ball.speed;

      this.currentRally++;
      this.rallyValEl.textContent = String(this.currentRally);

      if (this.currentRally > this.bestRally) {
        this.bestRally = this.currentRally;
        localStorage.setItem("terminal_pong_best_rally", String(this.bestRally));
        this.hiValEl.textContent = this.padScore(this.bestRally);
      }

      this.spawnSparks(this.player.x + this.player.w, this.ball.y, "#fbbf24", 8);
      this.playBeep(520 + Math.min(this.currentRally * 20, 360), 0.04, "sine");
      this.shakeAmount = Math.min(this.shakeAmount + 1.5, 4);
    }

    // CPU Paddle Collision (Right)
    if (
      this.ball.vx > 0 &&
      this.ball.x + this.ball.r >= this.cpu.x &&
      this.ball.x - this.ball.r <= this.cpu.x + this.cpu.w &&
      this.ball.y >= this.cpu.y - 2 &&
      this.ball.y <= this.cpu.y + this.cpu.h + 2
    ) {
      this.ball.x = this.cpu.x - this.ball.r;

      const relativeIntersectY = (this.ball.y - (this.cpu.y + this.cpu.h / 2)) / (this.cpu.h / 2);
      const clampedOffset = Math.max(-1, Math.min(1, relativeIntersectY));
      const maxBounceAngle = Math.PI / 4.2; // ~42.8 degrees max
      const bounceAngle = clampedOffset * maxBounceAngle;

      this.ball.speed = Math.min(cfg.maxBallSpeed, this.ball.speed + cfg.speedInc);
      this.ball.vx = -Math.cos(bounceAngle) * this.ball.speed;
      this.ball.vy = Math.sin(bounceAngle) * this.ball.speed;

      this.currentRally++;
      this.rallyValEl.textContent = String(this.currentRally);

      if (this.currentRally > this.bestRally) {
        this.bestRally = this.currentRally;
        localStorage.setItem("terminal_pong_best_rally", String(this.bestRally));
        this.hiValEl.textContent = this.padScore(this.bestRally);
      }

      this.spawnSparks(this.cpu.x, this.ball.y, "#ff6b4a", 8);
      this.playBeep(480 + Math.min(this.currentRally * 20, 360), 0.04, "sine");
    }

    // Score Check: Player Scores (Ball passed right)
    if (this.ball.x - this.ball.r > this.width) {
      this.playerScore++;
      this.pScoreEl.textContent = String(this.playerScore).padStart(2, "0");
      this.currentRally = 0;
      this.rallyValEl.textContent = "0";
      this.playPointScoreSound(true);

      if (this.playerScore >= this.winningScore) {
        this.gameOver = true;
        this.winner = "PLAYER";
        this.playVictorySound();
      } else {
        this.resetBall(-1);
      }
    }

    // Score Check: CPU Scores (Ball passed left)
    if (this.ball.x + this.ball.r < 0) {
      this.cpuScore++;
      this.cScoreEl.textContent = String(this.cpuScore).padStart(2, "0");
      this.currentRally = 0;
      this.rallyValEl.textContent = "0";
      this.playPointScoreSound(false);

      if (this.cpuScore >= this.winningScore) {
        this.gameOver = true;
        this.winner = "CPU";
        this.playDefeatSound();
      } else {
        this.resetBall(1);
      }
    }

    // Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.05;
      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    // Screen Shake Decay
    if (this.shakeAmount > 0) {
      this.shakeAmount *= 0.82;
      if (this.shakeAmount < 0.2) this.shakeAmount = 0;
    }
  }

  spawnSparks(x, y, color, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.8 + 1.0;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 2 + 1,
        alpha: 1
      });
    }
  }

  draw() {
    this.ctx.save();

    // Shake transform
    if (this.shakeAmount > 0) {
      const sx = (Math.random() - 0.5) * this.shakeAmount * 2;
      const sy = (Math.random() - 0.5) * this.shakeAmount * 2;
      this.ctx.translate(sx, sy);
    }

    // Dark Warm Desert Background (matching Dino Runner)
    this.ctx.fillStyle = "#18100a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Retro Grid
    this.ctx.strokeStyle = "rgba(245, 158, 11, 0.05)";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 28) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Center Dashed Net Line
    this.ctx.strokeStyle = "rgba(245, 158, 11, 0.28)";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Big Center Arena Watermark Score
    this.ctx.font = "800 38px 'Space Grotesk', sans-serif";
    this.ctx.fillStyle = "rgba(245, 158, 11, 0.07)";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`${this.playerScore}   ${this.cpuScore}`, this.width / 2, this.height / 2);

    // Ball Motion Trail
    this.ball.trail.forEach((t, i) => {
      const alpha = (i / this.ball.trail.length) * 0.32;
      const r = this.ball.r * (0.5 + (i / this.ball.trail.length) * 0.5);
      this.ctx.beginPath();
      this.ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
      this.ctx.fill();
    });

    // Glowing Neon Ball
    this.ctx.save();
    this.ctx.shadowColor = "#f59e0b";
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    this.ctx.fillStyle = "#fbbf24";
    this.ctx.fill();
    this.ctx.restore();

    // Player Paddle (Left - Amber Laser)
    this.ctx.save();
    this.ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
    this.ctx.shadowBlur = 8;
    this.ctx.fillStyle = "#f59e0b";
    this.ctx.beginPath();
    this.ctx.roundRect(this.player.x, this.player.y, this.player.w, this.player.h, 3);
    this.ctx.fill();
    this.ctx.restore();

    // CPU Paddle (Right - Coral Laser)
    this.ctx.save();
    this.ctx.shadowColor = "rgba(255, 107, 74, 0.6)";
    this.ctx.shadowBlur = 8;
    this.ctx.fillStyle = "#ff6b4a";
    this.ctx.beginPath();
    this.ctx.roundRect(this.cpu.x, this.cpu.y, this.cpu.w, this.cpu.h, 3);
    this.ctx.fill();
    this.ctx.restore();

    // Particle Sparks
    this.sparks.forEach(s => {
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;

    // Paused Screen Overlay
    if (this.paused && !this.gameOver) {
      this.ctx.fillStyle = "rgba(10, 6, 4, 0.78)";
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.font = "800 18px 'Space Grotesk', sans-serif";
      this.ctx.fillStyle = "#fbbf24";
      this.ctx.textAlign = "center";
      this.ctx.fillText("PAUSED", this.width / 2, this.height / 2 - 8);

      this.ctx.font = "500 11px monospace";
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      this.ctx.fillText("Press SPACE to Resume", this.width / 2, this.height / 2 + 14);
    }

    // Game Over Overlay
    if (this.gameOver) {
      this.ctx.fillStyle = "rgba(10, 6, 4, 0.86)";
      this.ctx.fillRect(0, 0, this.width, this.height);

      const won = this.winner === "PLAYER";
      this.ctx.font = "900 20px 'Space Grotesk', sans-serif";
      this.ctx.fillStyle = won ? "#10b981" : "#ef4444";
      this.ctx.textAlign = "center";
      this.ctx.fillText(won ? "VICTORY! YOU WON" : "GAME OVER — CPU WON", this.width / 2, this.height / 2 - 16);

      this.ctx.font = "600 12px 'Outfit', sans-serif";
      this.ctx.fillStyle = "#f59e0b";
      this.ctx.fillText(`Match: ${this.playerScore} - ${this.cpuScore}  |  Best Rally: ${this.bestRally}`, this.width / 2, this.height / 2 + 6);

      this.ctx.font = "500 11px monospace";
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.fillText("Press [SPACE] or Click to Play Again", this.width / 2, this.height / 2 + 28);
    }

    this.ctx.restore();
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.draw();
    if (this.running) {
      this.animId = requestAnimationFrame(() => this.loop());
    }
  }

  padScore(num) {
    return String(num).padStart(5, "0");
  }

  playBeep(freq, duration, type = "sine") {
    if (!this.running) return;
    try {
      if (window.soundEngine && !window.soundEngine.muted) {
        const ctx = window.soundEngine.ctx;
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

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

  playPaddleHitSound() {
    if (!this.running) return;
    this.playBeep(440, 0.06, "square");
  }

  playWallBounceSound() {
    if (!this.running) return;
    this.playBeep(260, 0.04, "sine");
  }

  playPointScoreSound(playerWon) {
    if (!this.running) return;
    if (playerWon) {
      this.playBeep(660, 0.08, "triangle");
      setTimeout(() => { if (this.running) this.playBeep(880, 0.12, "triangle"); }, 80);
    } else {
      this.playBeep(320, 0.1, "sawtooth");
      setTimeout(() => { if (this.running) this.playBeep(240, 0.15, "sawtooth"); }, 90);
    }
  }

  playVictorySound() {
    if (!this.running) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => { if (this.running) this.playBeep(freq, 0.15, "triangle"); }, idx * 100);
    });
  }

  playDefeatSound() {
    if (!this.running) return;
    const notes = [440.00, 370.00, 311.13, 261.63];
    notes.forEach((freq, idx) => {
      setTimeout(() => { if (this.running) this.playBeep(freq, 0.18, "sawtooth"); }, idx * 120);
    });
  }

  destroy() {
    this.running = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("touchmove", this.handleTouchMove);
    }

    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.remove();
    }

    if (this.terminal && this.terminal.activeGame === this) {
      this.terminal.activeGame = null;
    }
  }
}

window.TerminalPongGame = TerminalPongGame;
