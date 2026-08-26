
document.addEventListener("DOMContentLoaded", () => {
  // Ensure page always opens at top Hero section on fresh load
  if (!window.location.hash || window.location.hash === "#" || window.location.hash === "#about") {
    window.scrollTo(0, 0);
  }

  // Initialize Custom Animated Cursor
  initCustomCursor();

  // Initialize Background Particle Canvas (Warm Floating Embers)
  const particleEngine = new window.ParticleCanvas("bg-canvas");

  // Initialize Developer Terminal
  new window.InteractiveTerminal("hacker-terminal");

  // Initialize UI & Scroll Engines
  initScrollProgress();
  initHeaderNavigation();
  initScrollReveals();
  initLaserTimeline();
  initTypewriter();
  initHeroInteractivity();
  init3DCardTilt();
  initProjectSystem();
  initSkillsRadar();
  initThemeSystem(particleEngine);
  initAudioControls();
  initContactSystem();
  initMatrixEffect();
});
document.addEventListener('contextmenu', event => event.preventDefault());

/* ==========================================================================
   0. Animated Custom Cursor Engine (Smooth Lerp + Magnetic Physics)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (!isMoving) {
      isMoving = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
  });

  // Fade out cursor when leaving window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    isMoving = false;
  });

  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
    isMoving = true;
  });

  // Smooth lerp loop for outer magnetic ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Click squeeze animation
  window.addEventListener("mousedown", () => {
    document.body.classList.add("cursor-click");
  });

  window.addEventListener("mouseup", () => {
    document.body.classList.remove("cursor-click");
  });

  // Attach hover state to interactive elements
  function attachHoverListeners() {
    const interactiveEls = document.querySelectorAll(
      "a, button, input, textarea, .project-card, .physics-chip, .quick-cmd-pill, .bento-award-card, .avatar-card-3d, .filter-btn, .timeline-card"
    );

    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  attachHoverListeners();
  window.rebindCursorHovers = attachHoverListeners;
}

/* ==========================================================================
   1. Scroll Progress Bar & Scroll Telemetry
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress-bar");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   2. Sticky Header & Active Nav Section Tracking
   ========================================================================== */
function initHeaderNavigation() {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav-item-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinksMenu = document.getElementById("nav-links-menu");

  if (mobileMenuBtn && navLinksMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = navLinksMenu.classList.toggle("mobile-open");
      mobileMenuBtn.classList.toggle("active", isOpen);
      if (window.soundEngine) window.soundEngine.playClick();
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinksMenu.classList.remove("mobile-open");
        mobileMenuBtn.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (header && !header.contains(e.target)) {
        navLinksMenu.classList.remove("mobile-open");
        mobileMenuBtn.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. IntersectionObserver Scroll Reveals
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll:not(.bento-award-card)");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");

        const meters = entry.target.querySelectorAll(".skill-meter-fill");
        meters.forEach(meter => {
          const width = meter.getAttribute("data-width");
          if (width) meter.style.width = `${width}%`;
        });
      } else {
        // Reverse animation when scrolled out of view
        entry.target.classList.remove("is-revealed");
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => observer.observe(el));

  // Dedicated Reversible 1-by-1 Staggered Trigger for Awards Bento Grid
  const bentoGrid = document.querySelector(".awards-bento-grid");
  if (bentoGrid) {
    const bentoCards = bentoGrid.querySelectorAll(".bento-award-card");
    let bentoTimeouts = [];

    const bentoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        bentoTimeouts.forEach(t => clearTimeout(t));
        bentoTimeouts = [];

        if (entry.isIntersecting) {
          bentoCards.forEach((card, idx) => {
            const t = setTimeout(() => {
              card.classList.add("is-revealed");
            }, idx * 280);
            bentoTimeouts.push(t);
          });
        } else {
          bentoCards.forEach((card, idx) => {
            const reverseIdx = bentoCards.length - 1 - idx;
            const t = setTimeout(() => {
              card.classList.remove("is-revealed");
            }, reverseIdx * 90);
            bentoTimeouts.push(t);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });

    bentoObserver.observe(bentoGrid);
  }
}

/* ==========================================================================
   4. Scroll-Linked Laser Timeline (Warm Amber Track)
   ========================================================================== */
function initLaserTimeline() {
  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const laserFill = document.querySelector(".timeline-track-fill");
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (!timelineWrapper || !laserFill) return;

  function updateLaser() {
    const rect = timelineWrapper.getBoundingClientRect();
    const windowH = window.innerHeight;
    const startY = windowH * 0.7;
    const wrapperTop = rect.top;
    const wrapperHeight = rect.height;

    let progress = (startY - wrapperTop) / wrapperHeight;
    progress = Math.max(0, Math.min(1, progress));

    laserFill.style.height = `${progress * 100}%`;

    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < startY) {
        item.classList.add("active-node");
      } else {
        item.classList.remove("active-node");
      }
    });
  }

  window.addEventListener("scroll", updateLaser, { passive: true });
  window.addEventListener("resize", updateLaser);
  updateLaser();
}

/* ==========================================================================
   5. Hero Section Dynamic Greeting, Smooth Spotlight & Avatar Interactivity
   ========================================================================== */
function initHeroInteractivity() {
  const heroSection = document.querySelector(".hero-section");
  const greetingEl = document.getElementById("hero-dynamic-greeting");

  // Dynamic time-aware greeting
  if (greetingEl) {
    const hours = new Date().getHours();
    let timeGreeting = "Good Morning";
    let iconHtml = '<i class="fa-solid fa-sun"></i>';
    if (hours >= 12 && hours < 17) {
      timeGreeting = "Good Afternoon";
      iconHtml = '<i class="fa-solid fa-sun"></i>';
    } else if (hours >= 17 && hours < 22) {
      timeGreeting = "Good Evening";
      iconHtml = '<i class="fa-solid fa-cloud-sun"></i>';
    } else if (hours >= 22 || hours < 5) {
      timeGreeting = "Burning Midnight Oil";
      iconHtml = '<i class="fa-solid fa-moon"></i>';
    }
    greetingEl.innerHTML = `${iconHtml} <span>${timeGreeting}</span>`;
  }

  // Smooth Edge-Fading Mouse Spotlight over Hero
  if (heroSection) {
    heroSection.addEventListener("mouseenter", () => {
      heroSection.style.setProperty("--spotlight-opacity", "1");
    });

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Soft edge falloff as cursor approaches the section boundaries
      const edgePadding = 120;
      const distFromEdge = Math.min(x, y, rect.width - x, rect.height - y);
      const opacity = distFromEdge <= 0 ? 0 : Math.min(1, distFromEdge / edgePadding);

      heroSection.style.setProperty("--spotlight-x", `${x}px`);
      heroSection.style.setProperty("--spotlight-y", `${y}px`);
      heroSection.style.setProperty("--spotlight-opacity", opacity.toFixed(2));
    });

    heroSection.addEventListener("mouseleave", () => {
      heroSection.style.setProperty("--spotlight-opacity", "0");
    });
  }

  // Interactive Avatar Click: Sparks burst
  const avatarCard = document.getElementById("avatar-card");
  avatarCard?.addEventListener("click", () => {
    if (window.soundEngine) window.soundEngine.playSuccess();
    triggerWarmSparks(avatarCard);
    showToast('<i class="fa-solid fa-bolt"></i> Ayushman Sarkar — SXC Stat \'26');
  });
}

function triggerWarmSparks(element) {
  const rect = element.getBoundingClientRect();
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const sparks = [];
  const warmColors = ["#f59e0b", "#ff6b4a", "#fbbf24", "#ea580c", "#fff"];

  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    sparks.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      color: warmColors[Math.floor(Math.random() * warmColors.length)],
      alpha: 1
    });
  }

  let start = performance.now();
  function animateSparks(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.15; // Gravity
      s.alpha = Math.max(0, 1 - elapsed / 1200);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    });

    if (elapsed < 1200) {
      requestAnimationFrame(animateSparks);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(animateSparks);
}

/* ==========================================================================
   6. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById("typewriter-text");
  if (!target) return;

  const roles = [
    "Undergraduate Student",
    "Code & Coffee Enthusiast",
    "Statistics @ St. Xavier's College",
    "2x Hackathon Champion",
    "Open-Source Dev"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 90;

  function tick() {
    const current = roles[roleIdx];

    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ==========================================================================
   7. 3D Card Tilt Physics (Mouse Hover)
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll(".avatar-card-3d, .project-card, .bento-award-card");

  cards.forEach(card => {
    let bounds = null;

    function getBounds() {
      bounds = card.getBoundingClientRect();
    }

    card.addEventListener("mouseenter", () => {
      getBounds();
      card.style.transition = "transform 0.1s ease-out, border-color var(--transition-normal), box-shadow var(--transition-normal)";
      if (window.soundEngine) window.soundEngine.playHover();
    });

    card.addEventListener("mousemove", (e) => {
      if (!bounds) getBounds();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      const rotateX = ((y - centerY) / centerY) * -11;
      const rotateY = ((x - centerX) / centerX) * 11;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      bounds = null;
      card.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color var(--transition-normal), box-shadow var(--transition-normal)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

/* ==========================================================================
   8. Project Showcase, Filtering & Modal Viewer
   ========================================================================== */
function initProjectSystem() {
  const container = document.getElementById("projects-grid-container");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modalBackdrop = document.getElementById("project-modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  if (!container || !window.PROJECTS_DATA) return;

  function renderProjects(filter = "all") {
    container.innerHTML = "";

    const filtered = filter === "all"
      ? window.PROJECTS_DATA
      : window.PROJECTS_DATA.filter(p => p.category === filter);

    filtered.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className = `project-card ${p.featured ? 'featured' : ''} reveal-on-scroll reveal-delay-${(idx % 3) + 1}`;
      card.setAttribute("data-id", p.id);

      const statsKeys = Object.keys(p.stats);
      const statsPills = statsKeys.map(k => `<span class="mini-stat-pill">${p.stats[k]}</span>`).join("");
      const techChips = p.tags.slice(0, 4).map(t => `<span class="tech-chip">${t}</span>`).join("");

      card.innerHTML = `
        <div class="project-media-wrap">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
          <div class="project-overlay-badge">${p.categoryLabel}</div>
        </div>
        <div class="project-body">
          <div class="project-title-row">
            <h3 class="project-title">${p.title}</h3>
            <div class="project-arrow-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </div>
          </div>
          <p class="project-tagline">${p.tagline}</p>
          <div class="project-stats-pills">${statsPills}</div>
          <div class="project-tech-stack">${techChips}</div>
        </div>
      `;

      card.addEventListener("click", () => openProjectModal(p));
      container.appendChild(card);
    });

    init3DCardTilt();
    initScrollReveals();
    if (window.rebindCursorHovers) window.rebindCursorHovers();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playClick();
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");
      renderProjects(category);
    });
  });

  function openProjectModal(project) {
    if (!project) return;
    if (window.soundEngine && typeof window.soundEngine.playModalOpen === "function") {
      try { window.soundEngine.playModalOpen(); } catch (e) { }
    }

    const imgEl = document.getElementById("modal-img");
    if (imgEl) {
      imgEl.src = project.image || "";
      imgEl.alt = project.title || "Project Visual";
    }

    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.textContent = project.title || "";

    const taglineEl = document.getElementById("modal-tagline");
    if (taglineEl) taglineEl.textContent = project.tagline || "";

    const overviewEl = document.getElementById("modal-overview");
    if (overviewEl) overviewEl.textContent = project.overview || "";

    const metricsContainer = document.getElementById("modal-metrics-list");
    if (metricsContainer) {
      if (Array.isArray(project.metrics) && project.metrics.length > 0) {
        metricsContainer.innerHTML = project.metrics.map(m => `
          <div class="modal-metric-card">
            <div class="modal-metric-val">${m.value}</div>
            <div class="modal-metric-lbl">${m.label}</div>
          </div>
        `).join("");
        metricsContainer.style.display = "grid";
      } else {
        metricsContainer.innerHTML = "";
        metricsContainer.style.display = "none";
      }
    }

    const highlightsList = document.getElementById("modal-highlights-list");
    if (highlightsList) {
      if (Array.isArray(project.highlights) && project.highlights.length > 0) {
        highlightsList.innerHTML = project.highlights.map(h => `<li>${h}</li>`).join("");
        highlightsList.style.display = "flex";
      } else {
        highlightsList.innerHTML = "";
        highlightsList.style.display = "none";
      }
    }

    const tagsContainer = document.getElementById("modal-tech-list");
    if (tagsContainer) {
      if (Array.isArray(project.tags) && project.tags.length > 0) {
        tagsContainer.innerHTML = project.tags.map(t => `<span class="tech-chip">${t}</span>`).join("");
      } else {
        tagsContainer.innerHTML = "";
      }
    }

    const githubLink = document.getElementById("modal-github-link");
    const demoLink = document.getElementById("modal-demo-link");
    if (githubLink) {
      const ghUrl = project.links && project.links.github;
      if (ghUrl) {
        githubLink.href = ghUrl;
        githubLink.style.display = "inline-flex";
      } else {
        githubLink.style.display = "none";
      }
    }
    if (demoLink) {
      const demoUrl = project.links && (project.links.demo || project.links.paper);
      if (demoUrl) {
        demoLink.href = demoUrl;
        demoLink.style.display = "inline-flex";
      } else {
        demoLink.style.display = "none";
      }
    }

    if (modalBackdrop) {
      modalBackdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (window.soundEngine && typeof window.soundEngine.playModalClose === "function") {
      try { window.soundEngine.playModalClose(); } catch (e) { }
    }
    if (modalBackdrop) {
      modalBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  modalCloseBtn?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
      closeModal();
    }
  });

  renderProjects("all");
}

/* ==========================================================================
   9. Skills Radar Canvas (Warm Gradient Fill)
   ========================================================================== */
function initSkillsRadar() {
  const canvas = document.getElementById("skills-radar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const categories = [
    { name: "HCI & UI", value: 0.90 },
    { name: "Graphics/3D", value: 0.68 },
    { name: "Full-Stack", value: 0.96 },
    { name: "Systems", value: 0.75 },
    { name: "Algorithms", value: 0.95 },
    { name: "AI & ML", value: 0.64 }
  ];

  let animProgress = 0;

  function drawRadar() {
    ctx.clearRect(0, 0, size, size);
    const center = size / 2;
    const radius = 100;
    const total = categories.length;

    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.15)";
      ctx.stroke();

      const labelX = center + (radius + 24) * Math.cos(angle);
      const labelY = center + (radius + 24) * Math.sin(angle);
      ctx.font = "600 11px 'Outfit', sans-serif";
      ctx.fillStyle = "rgba(214, 198, 184, 0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(categories[i].name, labelX, labelY);
    }

    // Warm Golden Gradient Shape
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = radius * categories[i].value * animProgress;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(center, center, 10, center, center, radius);
    gradient.addColorStop(0, "rgba(245, 158, 11, 0.5)");
    gradient.addColorStop(1, "rgba(255, 107, 74, 0.25)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = radius * categories[i].value * animProgress;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (animProgress < 1) {
      animProgress += 0.025;
      requestAnimationFrame(drawRadar);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animProgress = 0;
      drawRadar();
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById("skills");
  if (skillsSection) observer.observe(skillsSection);

  const chips = document.querySelectorAll(".physics-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playClick();
      chip.style.transform = "scale(1.2) rotate(" + (Math.random() * 14 - 7) + "deg)";
      setTimeout(() => {
        chip.style.transform = "";
      }, 250);
    });
  });
}

/* ==========================================================================
   10. Warm Themes Management Engine (2 Curated Themes: Evening Dark & Warm Light)
   ========================================================================== */
function initThemeSystem(particleEngine) {
  const themeBtn = document.getElementById("theme-toggle-btn");
  let currentTheme = localStorage.getItem("portfolio_theme") || "dark";

  // Particle color sets for the 2 curated themes
  const colorMaps = {
    dark: {
      primary: "rgba(245, 158, 11, ",   // Warm Sunset Amber
      secondary: "rgba(234, 88, 12, ",  // Burnt Orange
      accent: "rgba(251, 191, 36, "     // Golden Horizon
    },
    light: {
      primary: "rgba(217, 119, 6, ",    // Cinnamon Amber
      secondary: "rgba(194, 65, 12, ",  // Terracotta
      accent: "rgba(180, 83, 9, "       // Bronze Gold
    }
  };

  function updateThemeButtonIcon(theme) {
    if (!themeBtn) return;
    if (theme === "light") {
      // Show Moon / Evening icon to switch to dark
      themeBtn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeBtn.setAttribute("title", "Switch to Dark Theme");
      themeBtn.setAttribute("aria-label", "Switch to Dark Theme");
    } else {
      // Show Sun icon to switch to light
      themeBtn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      themeBtn.setAttribute("title", "Switch to Light Theme");
      themeBtn.setAttribute("aria-label", "Switch to Light Theme");
    }
  }

  window.setAppTheme = function (themeName) {
    currentTheme = themeName === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("portfolio_theme", currentTheme);

    updateThemeButtonIcon(currentTheme);

    if (colorMaps[currentTheme] && particleEngine) {
      const c = colorMaps[currentTheme];
      particleEngine.setThemeColors(c.primary, c.secondary, c.accent);
    }
  };

  themeBtn?.addEventListener("click", () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    window.setAppTheme(nextTheme);

    if (window.soundEngine) {
      window.soundEngine.playThemeToggle(nextTheme);
    }

    const themeLabel = nextTheme === "light" ? "Light" : "Dark";
    showToast(`Switched to ${themeLabel}`);
  });

  // Keyboard shortcut: Press 'T' to toggle theme
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      themeBtn?.click();
    }
  });

  window.setAppTheme(currentTheme);
}

/* ==========================================================================
   11. Enhanced Audio Synthesizer Controls
   ========================================================================== */
function initAudioControls() {
  const audioBtn = document.getElementById("audio-toggle-btn");
  if (!audioBtn || !window.soundEngine) return;

  // Audio Enabled by Default
  const userMutedPref = localStorage.getItem("portfolio_audio_muted");
  const isInitiallyMuted = userMutedPref === "true";

  window.soundEngine.muted = isInitiallyMuted;

  if (!isInitiallyMuted) {
    audioBtn.classList.add("active");
    audioBtn.setAttribute("title", "Audio FX: ON (Click to Mute)");
  } else {
    audioBtn.classList.remove("active");
    audioBtn.setAttribute("title", "Audio FX: OFF (Click to Enable)");
  }

  // Audio Unlock on first user gesture (browser autoplay policy requirement)
  const unlockAudio = () => {
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.resume();
    }
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
  };
  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });

  audioBtn.addEventListener("click", () => {
    const isMuted = window.soundEngine.toggleMute();
    localStorage.setItem("portfolio_audio_muted", isMuted ? "true" : "false");
    if (!isMuted) {
      audioBtn.classList.add("active");
      audioBtn.setAttribute("title", "Audio FX: ON (Click to Mute)");
      showToast('<i class="fa-solid fa-volume-high"></i> Audio FX: ON');
    } else {
      audioBtn.classList.remove("active");
      audioBtn.setAttribute("title", "Audio FX: OFF (Click to Enable)");
      showToast('<i class="fa-solid fa-volume-xmark"></i> Audio Muted');
    }
  });

  // Micro-harmonic hover chords on interactive components
  const hoverTargets = document.querySelectorAll(
    "button, a, .quick-cmd-pill, .filter-btn, .project-card, .bento-award-card, .physics-chip, .skill-bar-item"
  );

  hoverTargets.forEach((el, index) => {
    el.addEventListener("mouseenter", () => {
      if (window.soundEngine) window.soundEngine.playHover(index);
    });

    el.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });
}

/* ==========================================================================
   12. Contact Form, Copy Email & Confetti Burst
   ========================================================================== */
function initContactSystem() {
  const copyBtn = document.getElementById("copy-email-btn");
  const form = document.getElementById("contact-form");

  copyBtn?.addEventListener("click", () => {
    const email = "ayushman.sarkar@outlook.com";
    navigator.clipboard.writeText(email).then(() => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      showToast('<i class="fa-solid fa-clipboard-check"></i> Email copied to clipboard: ' + email);
    }).catch(() => {
      showToast('<i class="fa-solid fa-envelope"></i> Email: ' + email);
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (window.soundEngine) window.soundEngine.playSuccess();
    triggerWarmConfetti();
    showToast('<i class="fa-solid fa-circle-check"></i> Message sent successfully!');
    form.reset();
  });
}

/* ==========================================================================
   13. Toast Notification
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
window.showToast = showToast;

/* ==========================================================================
   14. Warm Golden Confetti Cannon
   ========================================================================== */
function triggerWarmConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#f59e0b", "#ff6b4a", "#fbbf24", "#ea580c", "#fb7185", "#fff"];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.7,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() * -18) - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  let startTime = performance.now();

  function renderConfetti(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rotation += p.rotSpeed;
      p.opacity = Math.max(0, 1 - (elapsed / 3200));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (elapsed < 3200) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(renderConfetti);
}
window.triggerConfetti = triggerWarmConfetti;

/* ==========================================================================
   15. Full-Screen Matrix Rain Effect (Warm Amber Matrix)
   ========================================================================== */
function initMatrixEffect() {
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let matrixRunning = false;
  let intervalId = null;

  window.triggerMatrixEffect = function () {
    if (matrixRunning) return;
    matrixRunning = true;
    canvas.classList.add("active");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = "rgba(12, 9, 7, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f59e0b"; // Warm Amber rain
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    intervalId = setInterval(drawMatrix, 35);

    setTimeout(() => {
      clearInterval(intervalId);
      canvas.classList.remove("active");
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        matrixRunning = false;
      }, 500);
    }, 8000);
  };
}
