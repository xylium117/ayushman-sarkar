
class InteractiveTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.body = this.container.querySelector(".terminal-body");
    this.output = this.container.querySelector(".terminal-output");
    this.input = this.container.querySelector(".terminal-input");
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      chess: () => this.cmdChess(),
      pong: () => this.cmdPong(),
      pingpong: () => this.cmdPong(),
      dino: () => this.cmdDino(),
      runner: () => this.cmdDino(),
      game: () => this.cmdChess(),
      play: (arg) => {
        if (arg && arg.toLowerCase().includes("chess")) return this.cmdChess();
        if (arg && arg.toLowerCase().includes("pong")) return this.cmdPong();
        return this.cmdDino();
      },
      about: () => this.cmdAbout(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      education: () => this.cmdEducation(),
      gpa: () => "<i class='fa-solid fa-graduation-cap'></i> ICSE: <span class='term-highlight'>99.4% (AIR 3)</span> | ISC: <span class='term-highlight'>99.5% (AIR 3)</span> | St. Xavier's College",
      contact: () => "<i class='fa-solid fa-envelope'></i> Contact: <a href='#contact' class='term-link'>Jump to Contact Section</a><br><i class='fa-brands fa-github'></i> GitHub: <a href='https://github.com' target='_blank' class='term-link'>github.com/ayushmansarkar</a>",
      awards: () => "<i class='fa-solid fa-trophy'></i> <b>2nd Place Overall</b> — BITM Innovation Fest<br><i class='fa-solid fa-award'></i> <b>AIR 3 (99.4%)</b> — ICSE 2024<br><i class='fa-solid fa-award'></i> <b>AIR 3 (99.5%)</b> — ISC 2026",
      date: () => `<i class='fa-solid fa-clock'></i> Current Time: ${new Date().toLocaleString()}`,
      whoami: () => "visitor@workstation (Access Level: Guest / Potential Colleague)",
      matrix: () => this.cmdMatrix(),
      "sudo hire": () => this.cmdSudoHire(),
      hire: () => "Tip: Try with elevated permissions: <span class='term-cmd'>sudo hire</span>",
      clear: () => { this.clearActiveGames(); this.output.innerHTML = ""; return ""; },
      theme: (arg) => this.cmdTheme(arg),
      cat: (arg) => this.cmdCat(arg),
      banner: () => this.cmdBanner()
    };

    this.init();
  }

  init() {
    this.printInitialBanner();

    this.input.addEventListener("keydown", (e) => {
      if (window.soundEngine) window.soundEngine.playKeyClick();

      if (e.key === "Enter") {
        const fullCmd = this.input.value.trim();
        if (fullCmd) {
          this.history.push(fullCmd);
          this.historyIndex = this.history.length;
          this.execute(fullCmd);
          this.input.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        this.autocomplete(this.input.value);
      }
    });

    // Clicking anywhere in terminal body focuses the input
    this.body.addEventListener("click", () => {
      this.input.focus();
    });
  }

  printInitialBanner() {
    const banner = `
<div class='term-ascii'>
 █████╗ ██╗   ██╗██╗   ██╗███████╗██╗  ██╗███╗   ███╗ █████╗ ███╗   ██╗
██╔══██╗╚██╗ ██╔╝██║   ██║██╔════╝██║  ██║████╗ ████║██╔══██╗████╗  ██║
███████║ ╚████╔╝ ██║   ██║███████╗███████║██╔████╔██║███████║██╔██╗ ██║
██╔══██║  ╚██╔╝  ██║   ██║╚════██║██╔══██║██║╚██╔╝██║██╔══██║██║╚██╗██║
██║  ██║   ██║   ╚██████╔╝███████║██║  ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

███████╗ █████╗ ██████╗ ██╗  ██╗ █████╗ ██████╗ 
██╔════╝██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗██╔══██╗
███████╗███████║██████╔╝█████╔╝ ███████║██████╔╝
╚════██║██╔══██║██╔══██╗██╔═██╗ ██╔══██║██╔══██╗
███████║██║  ██║██║  ██║██║  ██╗██║  ██║██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
</div>
<div class='term-line'><i class="fa-solid fa-terminal"></i> <span class='term-highlight'>Aether-Shell v4.2.0-STABLE</span> (x86_64-darwin-browser)</div>
<div class='term-line'>Type <span class='term-cmd'>help</span> to view available commands, or click fast chips below.</div>
`;
    this.output.innerHTML = banner;
  }

  execute(rawCmd) {
    // Print input line
    const echoLine = document.createElement("div");
    echoLine.className = "term-history-line";
    echoLine.innerHTML = `<span class="term-prompt">ayushman@sxc:~$</span> <span class="term-entered-cmd">${this.escapeHtml(rawCmd)}</span>`;
    this.output.appendChild(echoLine);

    const parts = rawCmd.split(" ");
    const commandName = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    let result = "";
    if (rawCmd.toLowerCase() === "sudo hire" || rawCmd.toLowerCase() === "sudo hire me") {
      result = this.cmdSudoHire();
    } else if (this.commands[commandName]) {
      result = this.commands[commandName](arg);
    } else {
      result = `<span class='term-error'>zsh: command not found: ${this.escapeHtml(commandName)}</span>. Type <span class='term-cmd'>help</span> for valid commands.`;
    }

    if (result) {
      const respLine = document.createElement("div");
      respLine.className = "term-response";
      respLine.innerHTML = result;
      this.output.appendChild(respLine);
    }

    this.body.scrollTop = this.body.scrollHeight;
  }

  autocomplete(current) {
    const list = Object.keys(this.commands);
    const matches = list.filter(c => c.startsWith(current.toLowerCase()));
    if (matches.length === 1) {
      this.input.value = matches[0];
    }
  }

  cmdHelp() {
    return `
<div class='term-help-grid'>
  <div><span class='term-cmd'>chess</span></div><div>Launch Cyber Chess Engine (3 AI Levels + 3 Timers) <i class="fa-solid fa-chess"></i></div>
  <div><span class='term-cmd'>pong</span></div><div>Launch Cyber Pong Arcade (3 Difficulties + High Score) <i class="fa-solid fa-table-tennis-paddle-ball"></i></div>
  <div><span class='term-cmd'>dino</span></div><div>Launch Cyber Dino Terminal Runner Game <i class="fa-solid fa-gamepad"></i></div>
  <div><span class='term-cmd'>about</span></div><div>Display bio, background & focus areas</div>
  <div><span class='term-cmd'>projects</span></div><div>List flagship engineering projects</div>
  <div><span class='term-cmd'>skills</span></div><div>Inspect tech stack & framework proficiencies</div>
  <div><span class='term-cmd'>education</span></div><div>St. Xavier's College degree & academic standing</div>
  <div><span class='term-cmd'>gpa</span></div><div>Board examination scores & honors</div>
  <div><span class='term-cmd'>awards</span></div><div>Hackathons & innovation fest honors</div>
  <div><span class='term-cmd'>sudo hire</span></div><div>Execute hiring protocol with elevated priority</div>
  <div><span class='term-cmd'>contact</span></div><div>Direct email & social communication channels</div>
  <div><span class='term-cmd'>matrix</span></div><div>Activate full-screen Cyber Matrix rain</div>
  <div><span class='term-cmd'>clear</span></div><div>Clear terminal buffer</div>
</div>
`;
  }

  cmdChess() {
    this.clearActiveGames();
    if (window.TerminalChessGame) {
      this.activeGame = new window.TerminalChessGame(this, this.output);
      return "";
    }
    return "Error: Chess Game engine is loading...";
  }

  cmdPong() {
    this.clearActiveGames();
    if (window.TerminalPongGame) {
      this.activeGame = new window.TerminalPongGame(this, this.output);
      return "";
    }
    return "Error: Pong Game engine is loading...";
  }

  cmdDino() {
    this.clearActiveGames();
    if (window.TerminalDinoRunner) {
      this.activeGame = new window.TerminalDinoRunner(this, this.output);
      return "";
    }
    return "Error: Dino Runner engine is loading...";
  }

  clearActiveGames() {
    if (this.activeGame && typeof this.activeGame.destroy === "function") {
      this.activeGame.destroy();
      this.activeGame = null;
    }
    // Also sweep any lingering game DOM wrappers
    const oldChess = this.output.querySelectorAll(".chess-game-wrapper");
    oldChess.forEach(el => el.remove());
    const oldPong = this.output.querySelectorAll(".pong-game-wrapper");
    oldPong.forEach(el => el.remove());
    const oldDino = this.output.querySelectorAll(".dino-game-wrapper");
    oldDino.forEach(el => el.remove());
  }

  cmdAbout() {
    return `
<b>Ayushman Sarkar</b> — First-year Undergraduate studying Statistics @ St. Xavier's College, Kolkata, India.
Passionate about building, designing, and bringing creative engineering projects to life through software, data science, and interactive web experiences.
`;
  }

  cmdSkills() {
    return `
<span class='term-tag'>Languages:</span> Python, JavaScript, TypeScript, R, C/C++, SQL, HTML/CSS<br>
<span class='term-tag'>Frameworks & Libraries:</span> NumPy, Pandas, Scikit-Learn, React, Node.js, Web Audio, Canvas API<br>
<span class='term-tag'>Focus Areas:</span> Statistical Modeling, Full-Stack Development, Data Visualization, UI/UX Systems
`;
  }

  cmdProjects() {
    return `
1. <span class='term-highlight'>AetherOS</span> — Web Spatial OS & AI Desktop
2. <span class='term-highlight'>NeuroVision</span> — Neural Signal Classifier & Visualizer
3. <span class='term-highlight'>OmniGraph</span> — Semantic Knowledge Graph Universe
4. <span class='term-highlight'>QuantumCode</span> — Interactive Bloch Sphere Quantum IDE
5. <span class='term-highlight'>EcoPulse</span> — Environmental Data Analytics Platform
<br>Tip: Click any project card on the page to view detailed live interactive modal!
`;
  }

  cmdEducation() {
    return `
<i class="fa-solid fa-building-columns"></i> <b>St. Xavier's College, Kolkata</b> (2026 - Present)
Degree: B.Sc in Statistics (Honours)
Academic Milestones: ICSE 2024: 99.4% (All India Rank 3) | ISC 2026: 99.5% (All India Rank 3)
`;
  }

  cmdMatrix() {
    if (window.triggerMatrixEffect) {
      window.triggerMatrixEffect();
      return "<i class='fa-solid fa-circle' style='color:#10b981; font-size:0.75rem;'></i> <span class='term-highlight'>Matrix Rain mode activated for 8 seconds! Enjoy the cyberspace flow...</span>";
    }
    return "Matrix mode initializing...";
  }

  cmdSudoHire() {
    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.triggerConfetti) window.triggerConfetti();
    return `
<div class='term-success-box'>
  <i class="fa-solid fa-circle-check"></i> <b>[AUTH GRANTED]</b> Priority Offer Pipeline Unlocked!<br>
  Thank you for considering Ayushman Sarkar for your team.<br>
  <i class="fa-solid fa-arrow-right"></i> Please email directly at: <a href='mailto:ayushman.sarkar@outlook.com' class='term-link'>ayushman.sarkar@outlook.com</a><br>
  <i class="fa-solid fa-file-lines"></i> Direct Resume Download: <a href='#contact' class='term-link'>Jump to Contact Section</a>
</div>
`;
  }

  cmdTheme(themeName) {
    const valid = ["dark", "cosmic", "matrix", "light"];
    const theme = (themeName || "").trim().toLowerCase();
    if (valid.includes(theme)) {
      if (window.setAppTheme) {
        window.setAppTheme(theme);
        return `Theme switched to: <span class='term-highlight'>${theme}</span>`;
      }
    }
    return `Usage: <span class='term-cmd'>theme [dark | cosmic | matrix | light]</span>`;
  }

  cmdCat(filename) {
    if (!filename) return "cat: missing file operand. Try `cat resume.txt` or `cat goals.md`";
    if (filename.includes("resume")) {
      return "<i class='fa-solid fa-file-lines'></i> <b>Ayushman Sarkar Resume Summary</b>: First-year Statistics student at St. Xavier's College, Kolkata (AIR 3 ICSE & ISC).";
    }
    if (filename.includes("goal")) {
      return "<i class='fa-solid fa-bullseye'></i> <b>2026-2027 Goals</b>: Build impactful statistical modeling tools, explore ML pipelines, and contribute to open-source.";
    }
    return `cat: ${this.escapeHtml(filename)}: No such file or directory.`;
  }

  cmdBanner() {
    this.printInitialBanner();
    return "";
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

window.InteractiveTerminal = InteractiveTerminal;
