/**
 * Abhishek Vira - Web Audio API Chiptune Engine
 * Complies strictly with PRD: Starts 100% muted, no autoplay, visible toggle.
 * Procedurally generates retro 8-bit SFX and ambient adventure chiptune.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBgmPlaying = false;
    
    // Chill 8-bit adventure progression (pentatonic notes in Hz)
    this.bgmMelody = [
      523.25, 659.25, 783.99, 659.25, 523.25, 659.25, 880.00, 783.99,
      587.33, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25,
      440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00, 392.00,
      523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25
    ];

    this.bgmBass = [
      130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 196.00, 196.00,
      146.83, 146.83, 164.81, 164.81, 196.00, 196.00, 220.00, 220.00,
      110.00, 110.00, 130.81, 130.81, 146.83, 146.83, 164.81, 164.81,
      130.81, 130.81, 164.81, 164.81, 196.00, 196.00, 130.81, 130.81
    ];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      this.stopBgm();
    } else {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      }
      this.playInteract();
      this.startBgm();
    }
    return !this.isMuted;
  }

  playStep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 20, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {
      // Audio safety
    }
  }

  playInteract() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.08); // E5
      
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) {}
  }

  playDoorOpen() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        osc.stop(t + 0.13);
      });
    } catch (e) {}
  }

  playDoorClose() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [880, 659.25, 554.37, 440];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        osc.stop(t + 0.11);
      });
    } catch (e) {}
  }

  playDogBark() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(540, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.14);
      
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) {}
  }

  playSecretChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        osc.stop(t + 0.36);
      });
    } catch (e) {}
  }

  playSynthNote(freq, duration = 0.18, type = 'square') {
    this.ensureContext();
    if (this.isMuted) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);
      
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  }

  playReleasePreview(pattern) {
    this.ensureContext();
    if (this.isMuted) {
      this.toggleMute();
    }
    if (!pattern || !pattern.length) return;
    
    pattern.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSynthNote(freq, 0.22, 'sawtooth');
      }, idx * 160);
    });
  }

  startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    
    // Play mellow 8-bit tempo loop (140ms per 16th note step)
    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      
      const stepIdx = this.bgmStep % this.bgmMelody.length;
      const t = this.ctx.currentTime;
      
      // Melody note
      if (stepIdx % 2 === 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadFilter = this.ctx.createBiquadFilter();
        const leadGain = this.ctx.createGain();
        
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(this.bgmMelody[stepIdx], t);
        
        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(1200, t);
        
        leadGain.gain.setValueAtTime(0.035, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        
        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.masterGain);
        
        leadOsc.start(t);
        leadOsc.stop(t + 0.17);
      }
      
      // Bass line on downbeats
      if (stepIdx % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(this.bgmBass[stepIdx], t);
        
        bassGain.gain.setValueAtTime(0.05, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);
        
        bassOsc.start(t);
        bassOsc.stop(t + 0.25);
      }
      
      this.bgmStep++;
    }, 190);
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
  }
}

export const sound = new SoundEngine();
