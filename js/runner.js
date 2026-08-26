/**
 * Terminal Runner Game (Chrome Dino Style for Interactive CLI)
 * Warm Editorial / Cyberpunk Theme with gradual difficulty scaling, obstacles, and sound FX.
 */

class TerminalDinoRunner {
  constructor(terminalInstance, targetContainer) {
    this.terminal = terminalInstance;
    this.container = targetContainer;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.running = false;
    this.gameOver = false;

    // High score from localStorage
    this.highScore = parseInt(localStorage.getItem("terminal_dino_hi") || "0", 10);
    this.score = 0;
    this.scoreCounter = 0;
    
    // Balanced difficulty curve (gradual, smooth progression)
    this.baseSpeed = 4.8;
    this.speed = this.baseSpeed;
    this.maxSpeed = 10.5;
    this.distance = 0;

    // Day/Night Cycle
    this.isNight = false;

    // Game Objects
    this.dino = {
      x: 38,
      y: 108,
      baseY: 108,
      w: 26,
      h: 28,
      duckH: 18,
      vy: 0,
      gravity: 0.58,
      jumpForce: -10.5,
      isGrounded: true,
      isDucking: false,
      legFrame: 0,
      frameTimer: 0
    };

    this.obstacles = [];
    this.clouds = [];
    this.stars = [];
    this.groundPebbles = [];
    this.sparks = [];

    this.spawnTimer = 0;
    this.nextSpawnDistance = 45;

    // Bound Event Listeners
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleKeyUp = this.onKeyUp.bind(this);
    this.handleCanvasClick = this.onCanvasClick.bind(this);

    this.initDOM();
  }

  initDOM() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "dino-game-wrapper";

    this.wrapper.innerHTML = `
      <div class="dino-header">
        <div class="dino-title">
          <span class="dino-icon"><i class="fa-solid fa-gamepad"></i></span>
          <span>CYBER-DINO // v1.2</span>
        </div>
        <div class="dino-hud">
          <span class="dino-hi">HI <span id="dino-hi-val">${this.padScore(this.highScore)}</span></span>
          <span class="dino-score"><span id="dino-score-val">00000</span></span>
          <button class="dino-exit-btn" title="Exit Game [ESC]" aria-label="Exit Game"><i class="fa-solid fa-xmark"></i> ESC</button>
        </div>
      </div>
      <div class="dino-canvas-container">
        <canvas class="dino-canvas" width="600" height="150"></canvas>
        <div class="dino-mobile-controls">
          <button class="dino-ctrl-btn dino-btn-jump">▲ JUMP</button>
          <button class="dino-ctrl-btn dino-btn-duck">▼ DUCK</button>
        </div>
      </div>
      <div class="dino-footer">
        <span>Controls: <b>[SPACE / ▲ / TAP]</b> Jump &bull; <b>[▼ / S]</b> Duck &bull; <b>[ESC / Q]</b> Exit</span>
      </div>
    `;

    this.container.appendChild(this.wrapper);
    this.canvas = this.wrapper.querySelector(".dino-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.scoreValEl = this.wrapper.querySelector("#dino-score-val");
    this.hiValEl = this.wrapper.querySelector("#dino-hi-val");

    // Exit Button
    this.wrapper.querySelector(".dino-exit-btn").addEventListener("click", () => this.destroy());

    // Mobile Jump/Duck Buttons
    const jumpBtn = this.wrapper.querySelector(".dino-btn-jump");
    const duckBtn = this.wrapper.querySelector(".dino-btn-duck");

    jumpBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.jump(); });
    jumpBtn.addEventListener("mousedown", (e) => { e.preventDefault(); this.jump(); });

    duckBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.dino.isDucking = true; });
    duckBtn.addEventListener("touchend", (e) => { e.preventDefault(); this.dino.isDucking = false; });
    duckBtn.addEventListener("mousedown", (e) => { e.preventDefault(); this.dino.isDucking = true; });
    duckBtn.addEventListener("mouseup", (e) => { e.preventDefault(); this.dino.isDucking = false; });

    // Canvas click/tap to jump or restart
    this.canvas.addEventListener("click", this.handleCanvasClick);
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.handleCanvasClick();
    }, { passive: false });

    // Global Key Events
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    // Initial scenery
    this.initScenery();

    // Start game loop
    this.running = true;
    this.gameOver = false;
    this.loop();

    // Scroll terminal to bring game into clear view
    if (this.terminal && this.terminal.body) {
      setTimeout(() => {
        this.terminal.body.scrollTop = this.terminal.body.scrollHeight;
      }, 50);
    }
  }

  initScenery() {
    this.clouds = [
      { x: 120, y: 22, speed: 0.6, scale: 0.9 },
      { x: 340, y: 32, speed: 0.4, scale: 1.1 },
      { x: 520, y: 18, speed: 0.5, scale: 0.8 }
    ];

    this.stars = [
      { x: 50, y: 15, size: 1.5, alpha: 0.8 },
      { x: 160, y: 30, size: 1, alpha: 0.6 },
      { x: 280, y: 12, size: 2, alpha: 0.9 },
      { x: 420, y: 28, size: 1.2, alpha: 0.7 },
      { x: 560, y: 18, size: 1.8, alpha: 0.85 }
    ];

    this.groundPebbles = [];
    for (let i = 0; i < 30; i++) {
      this.groundPebbles.push({
        x: Math.random() * 600,
        y: 138 + Math.random() * 8,
        length: Math.random() * 6 + 2
      });
    }
  }

  onKeyDown(e) {
    if (!this.running) return;

    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      e.preventDefault();
      if (this.gameOver) {
        this.restart();
      } else {
        this.jump();
      }
    } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      if (!this.gameOver) {
        this.dino.isDucking = true;
      }
    } else if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
      e.preventDefault();
      this.destroy();
    } else if (e.key === "Enter" && this.gameOver) {
      e.preventDefault();
      this.restart();
    }
  }

  onKeyUp(e) {
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      this.dino.isDucking = false;
    }
  }

  onCanvasClick() {
    if (this.gameOver) {
      this.restart();
    } else {
      this.jump();
    }
  }

  jump() {
    if (this.dino.isGrounded && !this.gameOver) {
      this.dino.vy = this.dino.jumpForce;
      this.dino.isGrounded = false;
      this.playBeep(480, 0.08, "sine");
      this.addJumpSparks();
    }
  }

  addJumpSparks() {
    for (let i = 0; i < 5; i++) {
      this.sparks.push({
        x: this.dino.x + 6 + Math.random() * 12,
        y: this.dino.baseY + 26,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 0.5,
        life: 1
      });
    }
  }

  restart() {
    this.gameOver = false;
    this.score = 0;
    this.scoreCounter = 0;
    this.speed = this.baseSpeed;
    this.distance = 0;
    this.obstacles = [];
    this.sparks = [];
    this.dino.y = this.dino.baseY;
    this.dino.vy = 0;
    this.dino.isGrounded = true;
    this.dino.isDucking = false;
    this.spawnTimer = 0;
    this.nextSpawnDistance = 45;
    this.isNight = false;
    this.playBeep(620, 0.12, "triangle");
  }

  destroy() {
    this.running = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    // Save final high score
    if (this.score > this.highScore) {
      this.highScore = Math.floor(this.score);
      localStorage.setItem("terminal_dino_hi", this.highScore.toString());
    }

    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.remove();
    }

    if (this.terminal && this.terminal.activeGame === this) {
      this.terminal.activeGame = null;
    }
  }

  update() {
    if (this.gameOver) return;

    // Score & Sub-linear gradual difficulty scaling
    this.scoreCounter += 0.22;
    this.score = Math.floor(this.scoreCounter);
    this.distance += this.speed;

    if (this.scoreValEl) {
      this.scoreValEl.textContent = this.padScore(this.score);
    }

    // High Score tracking
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (this.hiValEl) this.hiValEl.textContent = this.padScore(this.highScore);
      localStorage.setItem("terminal_dino_hi", this.highScore.toString());
    }

    // Milestone sound every 100 points
    if (this.score > 0 && this.score % 100 === 0 && this.scoreCounter % 1 < 0.22) {
      this.playMilestoneChime();
    }

    // Smooth, gradual speed scaling (power 0.52 avoids rapid spikes)
    this.speed = Math.min(this.maxSpeed, this.baseSpeed + Math.pow(this.score, 0.52) * 0.16);

    // Day/Night Cycle transition every 400 pts
    this.isNight = Math.floor(this.score / 400) % 2 === 1;

    // Update Dino physics
    this.dino.y += this.dino.vy;
    this.dino.vy += this.dino.gravity;

    const currentBaseY = this.dino.isDucking ? (this.dino.baseY + 10) : this.dino.baseY;

    if (this.dino.y >= currentBaseY) {
      this.dino.y = currentBaseY;
      this.dino.vy = 0;
      this.dino.isGrounded = true;
    }

    // Leg animation cycling
    this.dino.frameTimer += this.speed * 0.08;
    if (this.dino.frameTimer >= 1) {
      this.dino.legFrame = (this.dino.legFrame + 1) % 2;
      this.dino.frameTimer = 0;
    }

    // Update Clouds
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -60) c.x = 640 + Math.random() * 60;
    });

    // Update Ground Pebbles
    this.groundPebbles.forEach(p => {
      p.x -= this.speed;
      if (p.x < -10) p.x = 600 + Math.random() * 20;
    });

    // Spawn Obstacles with dynamically fair distance buffer
    this.spawnTimer += this.speed * 0.085;
    if (this.spawnTimer >= this.nextSpawnDistance) {
      this.spawnObstacle();
      this.spawnTimer = 0;
      const minGap = Math.max(48, 36 + this.speed * 3.2);
      this.nextSpawnDistance = minGap + Math.random() * (30 + this.speed * 1.8);
    }

    // Update Obstacles & Collision Check
    const currentH = this.dino.isDucking ? this.dino.duckH : this.dino.h;
    const currentW = this.dino.isDucking ? 32 : this.dino.w;

    // Dino hitbox (with fair padding)
    const dinoHitbox = {
      x: this.dino.x + 4,
      y: this.dino.y + 2,
      w: currentW - 8,
      h: currentH - 4
    };

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;

      // Flapping pterodactyl wings
      if (obs.type === "pterodactyl") {
        obs.wingTimer = (obs.wingTimer || 0) + 0.15;
        obs.wingFrame = Math.floor(obs.wingTimer) % 2;
      }

      // Collision detection (AABB)
      if (
        dinoHitbox.x < obs.x + obs.w - 3 &&
        dinoHitbox.x + dinoHitbox.w > obs.x + 3 &&
        dinoHitbox.y < obs.y + obs.h - 2 &&
        dinoHitbox.y + dinoHitbox.h > obs.y + 2
      ) {
        this.triggerGameOver();
        break;
      }

      // Remove off-screen obstacles
      if (obs.x < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.05;
      if (s.life <= 0) this.sparks.splice(i, 1);
    }
  }

  spawnObstacle() {
    const r = Math.random();

    // Pterodactyls appear progressively once score > 180
    if (this.score > 180 && r > 0.68) {
      const altitudes = [84, 104, 118]; // High (duck under), Mid (jump or duck), Low (jump over)
      const alt = altitudes[Math.floor(Math.random() * altitudes.length)];
      this.obstacles.push({
        type: "pterodactyl",
        x: 610,
        y: alt,
        w: 28,
        h: 20,
        wingFrame: 0,
        wingTimer: 0
      });
    } else {
      // Progressive Cacti types based on score
      let cactusTypes = [
        { type: "cactus_small", w: 14, h: 26, y: 110 }
      ];

      if (this.score > 60) {
        cactusTypes.push({ type: "cactus_large", w: 18, h: 36, y: 100 });
      }
      if (this.score > 120) {
        cactusTypes.push({ type: "cactus_double", w: 26, h: 26, y: 110 });
      }
      if (this.score > 250) {
        cactusTypes.push({ type: "cactus_cluster", w: 38, h: 32, y: 104 });
      }

      const chosen = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
      this.obstacles.push({
        type: chosen.type,
        x: 610,
        y: chosen.y,
        w: chosen.w,
        h: chosen.h
      });
    }
  }

  triggerGameOver() {
    this.gameOver = true;
    this.playGameOverSound();

    // Create explosion sparks
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      this.sparks.push({
        x: this.dino.x + 12,
        y: this.dino.y + 12,
        vx: Math.cos(angle) * (Math.random() * 4 + 1),
        vy: Math.sin(angle) * (Math.random() * 4 + 1),
        life: 1
      });
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Palette Definition
    const bg = this.isNight ? "#0d0805" : "#18100a";
    const groundColor = this.isNight ? "rgba(245, 158, 11, 0.35)" : "rgba(234, 88, 12, 0.4)";
    const dinoColor = this.isNight ? "#fbbf24" : "#f59e0b";
    const cactusColor = this.isNight ? "#ea580c" : "#ff7849";
    const pteroColor = this.isNight ? "#f87171" : "#f97316";

    // 1. Clear & Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Stars & Moon (Night Mode) or Sun/Clouds (Day Mode)
    if (this.isNight) {
      // Moon
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(530, 28, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(526, 26, 11, 0, Math.PI * 2);
      ctx.fill();

      // Stars
      ctx.fillStyle = "#fef08a";
      this.stars.forEach(s => {
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(Date.now() * 0.003 + s.x) * 0.4);
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1;
    } else {
      // Clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      this.clouds.forEach(c => this.drawCloud(ctx, c.x, c.y, c.scale));
    }

    // 3. Ground Horizon Line
    ctx.strokeStyle = groundColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 137);
    ctx.lineTo(W, 137);
    ctx.stroke();

    // Ground dashes / moving texture
    ctx.fillStyle = groundColor;
    this.groundPebbles.forEach(p => {
      ctx.fillRect(p.x, p.y, p.length, 1.5);
    });

    // 4. Draw Obstacles
    this.obstacles.forEach(obs => {
      if (obs.type.startsWith("cactus")) {
        this.drawCactus(ctx, obs.x, obs.y, obs.w, obs.h, obs.type, cactusColor);
      } else if (obs.type === "pterodactyl") {
        this.drawPterodactyl(ctx, obs.x, obs.y, obs.wingFrame, pteroColor);
      }
    });

    // 5. Draw Dino
    this.drawDino(ctx, this.dino.x, this.dino.y, dinoColor);

    // 6. Draw Sparks
    this.sparks.forEach(s => {
      ctx.fillStyle = `rgba(251, 191, 36, ${s.life})`;
      ctx.fillRect(s.x, s.y, 2.5, 2.5);
    });

    // 7. Game Over Overlay Screen
    if (this.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#ea580c";
      ctx.font = "900 18px 'Syne', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("G A M E   O V E R", W / 2, H / 2 - 10);

      ctx.fillStyle = "#fdfaf6";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillText("PRESS [SPACE / ENTER] TO RESTART", W / 2, H / 2 + 15);

      ctx.fillStyle = "rgba(245, 158, 11, 0.85)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("SCORE: " + this.score + "  //  HIGH: " + this.highScore, W / 2, H / 2 + 35);
    }
  }

  drawDino(ctx, x, y, color) {
    ctx.fillStyle = color;

    if (this.gameOver) {
      // Dead / Crash Dino
      this.renderPixelSprite(ctx, x, y, this.dinoPixelDead());
    } else if (this.dino.isDucking) {
      // Ducking Dino
      this.renderPixelSprite(ctx, x, y, this.dino.legFrame === 0 ? this.dinoPixelDuck1() : this.dinoPixelDuck2());
    } else if (!this.dino.isGrounded) {
      // Jumping Dino
      this.renderPixelSprite(ctx, x, y, this.dinoPixelJump());
    } else {
      // Running Dino
      this.renderPixelSprite(ctx, x, y, this.dino.legFrame === 0 ? this.dinoPixelRun1() : this.dinoPixelRun2());
    }
  }

  renderPixelSprite(ctx, startX, startY, matrix) {
    const pixelSize = 2;
    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 1) {
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }

  // --- Pixel Matrices for Dino ---
  dinoPixelRun1() {
    return [
      [0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,1,1,1,1,1,1,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0],
      [1,0,0,1,1,1,1,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,0,1,0,0,0,0,0,0],
      [0,0,0,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,0,0]
    ];
  }

  dinoPixelRun2() {
    return [
      [0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,1,1,1,1,1,1,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0],
      [1,0,0,1,1,1,1,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,0,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0]
    ];
  }

  dinoPixelJump() {
    return [
      [0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,1,1,1,1,1,1,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0],
      [1,0,0,1,1,1,1,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,0,1,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,1,0,0,0,0,0],
      [0,0,0,1,1,0,0,1,1,0,0,0,0]
    ];
  }

  dinoPixelDuck1() {
    return [
      [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0]
    ];
  }

  dinoPixelDuck2() {
    return [
      [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
    ];
  }

  dinoPixelDead() {
    return [
      [0,0,0,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,1,1,0,1,0,1,1],
      [0,0,0,0,0,0,1,1,1,0,1,1,1],
      [0,0,0,0,0,0,1,1,0,1,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,1,1,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0],
      [1,0,0,1,1,1,1,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,0,1,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,1,0,0,0,0,0],
      [0,0,0,1,1,0,0,1,1,0,0,0,0]
    ];
  }

  drawCactus(ctx, x, y, w, h, type, color) {
    ctx.fillStyle = color;
    const trunkW = 6;
    const trunkX = x + (w - trunkW) / 2;
    ctx.fillRect(trunkX, y, trunkW, h);
    ctx.fillRect(trunkX - 1, y, trunkW + 2, 2);

    if (type === "cactus_small" || type === "cactus_large") {
      ctx.fillRect(trunkX - 5, y + 8, 5, 4);
      ctx.fillRect(trunkX - 5, y + 3, 4, 6);
      ctx.fillRect(trunkX + trunkW, y + 12, 5, 4);
      ctx.fillRect(trunkX + trunkW + 1, y + 7, 4, 6);
    } else if (type === "cactus_double") {
      ctx.fillRect(x, y + 6, 6, h - 6);
      ctx.fillRect(x + 12, y, 7, h);
      ctx.fillRect(x + 5, y + 14, 8, 4);
    } else {
      ctx.fillRect(x, y + 8, 5, h - 8);
      ctx.fillRect(x + 9, y, 7, h);
      ctx.fillRect(x + 20, y + 6, 6, h - 6);
      ctx.fillRect(x + 4, y + 15, 6, 4);
      ctx.fillRect(x + 15, y + 12, 6, 4);
    }
  }

  drawPterodactyl(ctx, x, y, wingFrame, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + 8, y + 6, 14, 5);
    ctx.fillRect(x, y + 4, 9, 4);
    ctx.fillRect(x - 4, y + 6, 4, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 4, y + 4, 2, 2);
    ctx.fillStyle = color;

    if (wingFrame === 0) {
      ctx.fillRect(x + 10, y - 6, 6, 12);
      ctx.fillRect(x + 12, y - 9, 3, 4);
    } else {
      ctx.fillRect(x + 10, y + 9, 6, 10);
      ctx.fillRect(x + 12, y + 17, 3, 4);
    }
  }

  drawCloud(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.arc(12, -4, 12, 0, Math.PI * 2);
    ctx.arc(26, 0, 10, 0, Math.PI * 2);
    ctx.rect(-6, 0, 36, 10);
    ctx.fill();
    ctx.restore();
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

  playMilestoneChime() {
    if (!this.running) return;
    this.playBeep(880, 0.08, "triangle");
    setTimeout(() => { if (this.running) this.playBeep(1174, 0.12, "triangle"); }, 80);
  }

  playGameOverSound() {
    if (!this.running) return;
    this.playBeep(180, 0.25, "sawtooth");
    setTimeout(() => { if (this.running) this.playBeep(120, 0.35, "sawtooth"); }, 120);
  }
}

window.TerminalDinoRunner = TerminalDinoRunner;
