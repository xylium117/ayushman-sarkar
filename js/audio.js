

class EnhancedSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.ambientOscs = [];
    this.filterNode = null;
    this.muted = false; // Starts muted until user clicks Audio toggle
    this.initialized = false;
    this.noteScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Warm C Major Pentatonic
    this.hoverNoteIdx = 0;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Master Output with Soft Limiter
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      // Low-pass Filter for Warm Analog Tone
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(2400, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policy.", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.resume();
    this.muted = !this.muted;

    if (!this.muted) {
      this.startAmbientDrone();
      this.playChime();
    } else {
      this.stopAmbientDrone();
    }

    return this.muted;
  }

  // --- Warm Ambient Drone / Pad ---
  startAmbientDrone() {
    if (this.muted || !this.ctx || this.ambientOscs.length > 0) return;
    this.resume();

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 2.0);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    // Warm Chord: Root (55Hz), 5th (82.4Hz), Octave (110Hz)
    const freqs = [55, 82.4, 110];
    this.ambientOscs = freqs.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i === 1 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle warm detune
      osc.detune.setValueAtTime((i - 1) * 4, this.ctx.currentTime);
      osc.connect(droneFilter);
      osc.start();
      return osc;
    });

    droneFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
  }

  stopAmbientDrone() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.ambientOscs.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        this.ambientOscs = [];
      }, 600);
    }
  }

  // --- Interactive Sound Effects ---

  /**
   * Warm Harmonic Magnetic Hover Pop
   */
  playHover(scaleIdx = null) {
    if (this.muted || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const note = scaleIdx !== null
      ? this.noteScale[scaleIdx % this.noteScale.length]
      : this.noteScale[this.hoverNoteIdx % this.noteScale.length];

    this.hoverNoteIdx = (this.hoverNoteIdx + 1) % this.noteScale.length;

    const now = this.ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(note, now);
    osc.frequency.exponentialRampToValueAtTime(note * 1.05, now + 0.06);

    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(note / 2, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.09);
    subOsc.stop(now + 0.09);
  }

  /**
   * Crisp, tactile warm click
   */
  playClick() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Theme Switch Musical Arpeggio
   * @param {string} newTheme - "dark" | "light"
   */
  playThemeToggle(newTheme) {
    if (this.muted || !this.ctx) return;
    this.resume();

    const isLight = newTheme === "light";
    // Light: Ascending warm sun notes (C5 -> E5 -> G5 -> C6)
    // Dark: Descending warm evening dusk notes (G5 -> E5 -> C5 -> G4)
    const notes = isLight ? [523.25, 659.25, 783.99, 1046.50] : [783.99, 659.25, 523.25, 392.00];

    notes.forEach((freq, i) => {
      const startTime = this.ctx.currentTime + (i * 0.07);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isLight ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(startTime);
      osc.stop(startTime + 0.24);
    });
  }

  /**
   * General warm welcoming chime
   */
  playChime() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + (idx * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  /**
   * Celebration / Success Cascade
   */
  playSuccess() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const startTime = this.ctx.currentTime + (i * 0.06);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Terminal Keypress Tick
   */
  playKeyClick() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(700 + Math.random() * 200, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Modal Open Smooth Warm Chime
   */
  playModalOpen() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const notes = [440.00, 554.37, 659.25]; // A4 -> C#5 -> E5 warm major triad
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + (idx * 0.05);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, startTime + 0.18);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  /**
   * Modal Close Soft Click / Descending Pop
   */
  playModalClose() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

window.soundEngine = new EnhancedSoundEngine();
