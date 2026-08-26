
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.particles = [];
    this.maxParticles = window.innerWidth < 768 ? 45 : 95;
    this.mouse = { x: -1000, y: -1000, radius: 150, targetRadius: 150 };

    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = performance.now();

    // Default Warm Amber & Sunset Embers
    this.themeColors = {
      primary: "rgba(245, 158, 11, ",   // Golden Amber
      secondary: "rgba(255, 107, 74, ", // Sunset Coral
      accent: "rgba(251, 191, 36, "     // Honey Gold
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.targetRadius = 150;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.targetRadius = 0;
    });

    window.addEventListener("scroll", () => {
      const now = performance.now();
      const dt = Math.max(now - this.lastScrollTime, 1);
      const dy = window.scrollY - this.lastScrollY;
      const speed = (dy / dt) * 15;

      this.scrollVelocity = Math.max(-25, Math.min(25, speed));
      this.lastScrollY = window.scrollY;
      this.lastScrollTime = now;
    }, { passive: true });

    this.createParticles();
    this.animate();
  }

  setThemeColors(primary, secondary, accent) {
    this.themeColors.primary = primary;
    this.themeColors.secondary = secondary;
    this.themeColors.accent = accent;
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.4 + 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseVy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.65 + 0.25,
        colorType: Math.random() > 0.4 ? "primary" : (Math.random() > 0.5 ? "secondary" : "accent"),
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  animate() {
    this.scrollVelocity *= 0.94;
    if (Math.abs(this.scrollVelocity) < 0.05) this.scrollVelocity = 0;

    // Smoothly interpolate mouse radius on move in / move out
    this.mouse.radius += (this.mouse.targetRadius - this.mouse.radius) * 0.12;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Pulse alpha for glowing ember effect
      p.pulseVal += p.pulseSpeed;
      const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulseVal));

      // Scroll velocity warp
      const currentVy = p.baseVy - (this.scrollVelocity * 0.25);

      p.x += p.vx;
      p.y += currentVy;

      // Mouse repulsion/gravitation
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.6;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      // Wrap edges
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const colorPrefix = this.themeColors[p.colorType] || this.themeColors.primary;
      const alphaMult = isLight ? 0.75 : 1;

      this.ctx.beginPath();
      if (Math.abs(this.scrollVelocity) > 2) {
        // Warp streak
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x, p.y - this.scrollVelocity * 2.2);
        this.ctx.strokeStyle = `${colorPrefix}${dynamicAlpha * alphaMult})`;
        this.ctx.lineWidth = p.size;
        this.ctx.stroke();
      } else {
        // Warm glowing orb
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${colorPrefix}${dynamicAlpha * alphaMult})`;
        this.ctx.fill();
      }

      // Constellation lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        const maxDist = 115;
        if (cdist < maxDist) {
          const lineAlpha = (1 - cdist / maxDist) * 0.16 * (isLight ? 0.45 : 1);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `${this.themeColors.primary}${lineAlpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleCanvas = ParticleCanvas;
