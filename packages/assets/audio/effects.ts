/**
 * Haya Soundscape Effects
 * Extracted from haya-soundscape.html
 */

export interface SoundscapeState {
  breath: boolean;
  owl: boolean;
  crystal: boolean;
  wind: boolean;
}

export interface SoundscapeController {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggleLayer: (name: keyof SoundscapeState, enabled: boolean) => void;
  getAnalyser: () => AnalyserNode | null;
}

export function createHayaSoundscape(ctx: AudioContext): SoundscapeController {
  let master: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let playing = false;
  
  let owlTimer: any = null;
  let crystalTimer: any = null;
  
  const state: SoundscapeState = {
    breath: true,
    owl: true,
    crystal: true,
    wind: true
  };

  const nodes: Record<string, { gain: GainNode; oscs?: (OscillatorNode | GainNode)[]; src?: AudioBufferSourceNode }> = {};

  function mkRev(dur: number, dec: number) {
    const len = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, dec);
    }
    const cv = ctx.createConvolver();
    cv.buffer = buf;
    return cv;
  }

  function makeBreath() {
    if (!master) return;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    const rev = mkRev(5, 1.8);
    const rG = ctx.createGain();
    rG.gain.setValueAtTime(0.65, ctx.currentTime);
    
    const chord = [110, 138.6, 165, 220, 261.6, 277.2, 330];
    const vols = [0.55, 0.32, 0.42, 0.28, 0.2, 0.15, 0.1];
    
    const oscs: (OscillatorNode | GainNode)[] = [];
    
    chord.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f * (1 + Math.random() * 0.002), ctx.currentTime);
      
      const og = ctx.createGain();
      og.gain.setValueAtTime(vols[i], ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.055 + i * 0.012, ctx.currentTime);
      
      const lG = ctx.createGain();
      lG.gain.setValueAtTime(f * 0.003, ctx.currentTime);
      
      lfo.connect(lG);
      lG.connect(o.frequency);
      o.connect(og);
      og.connect(g);
      
      o.start();
      lfo.start();
      
      oscs.push(o, lfo, og, lG);
    });

    const bLFO = ctx.createOscillator();
    bLFO.type = 'sine';
    bLFO.frequency.setValueAtTime(1 / 7, ctx.currentTime);
    const blG = ctx.createGain();
    blG.gain.setValueAtTime(0.16, ctx.currentTime);
    bLFO.connect(blG);
    blG.connect(g.gain);
    bLFO.start();
    
    oscs.push(bLFO, blG);

    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(850, ctx.currentTime);
    
    g.connect(filt);
    filt.connect(rev);
    rev.connect(rG);
    rG.connect(master);
    filt.connect(master);
    
    g.gain.linearRampToValueAtTime(state.breath ? 0.2 : 0, ctx.currentTime + 7);
    
    nodes.breath = { gain: g, oscs };
  }

  function makeWind() {
    if (!master) return;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(260, ctx.currentTime);
    f1.Q.setValueAtTime(0.4, ctx.currentTime);
    
    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(480, ctx.currentTime);
    f2.Q.setValueAtTime(0.3, ctx.currentTime);
    
    const rev = mkRev(6, 2.2);
    const rG = ctx.createGain();
    rG.gain.setValueAtTime(0.75, ctx.currentTime);
    
    src.connect(f1);
    f1.connect(g);
    src.connect(f2);
    f2.connect(g);
    g.connect(rev);
    rev.connect(rG);
    rG.connect(master);
    
    g.gain.linearRampToValueAtTime(state.wind ? 0.05 : 0, ctx.currentTime + 9);
    src.start();
    
    nodes.wind = { gain: g, src };
  }

  function fireOwl() {
    if (!playing || !state.owl || !master) return;
    const now = ctx.currentTime;
    const base = 170 + Math.random() * 50;
    const rev = mkRev(4, 2.4);
    const rG = ctx.createGain();
    rG.gain.setValueAtTime(0.85, now);
    rev.connect(rG);
    rG.connect(master);

    [0, 0.88].forEach((offset, hi) => {
      const t = now + offset;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.085, t + 0.2);
      env.gain.setValueAtTime(0.085, t + 0.52);
      env.gain.linearRampToValueAtTime(0, t + 1.1);
      
      [1, 1.99, 3.02].forEach((ratio, j) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        const f = base * (hi ? 0.87 : 1) * ratio;
        o.frequency.setValueAtTime(f * 1.04, t);
        o.frequency.linearRampToValueAtTime(f * (hi ? 0.9 : 0.96), t + 1.1);
        
        const hG = ctx.createGain();
        hG.gain.setValueAtTime([1, 0.1, 0.035][j], t);
        
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.setValueAtTime(580, t);
        filt.Q.setValueAtTime(3.5, t);
        
        o.connect(filt);
        filt.connect(hG);
        hG.connect(env);
        env.connect(rev);
        env.connect(master!);
        
        o.start(t);
        o.stop(t + 1.25);
      });
    });
    
    owlTimer = setTimeout(fireOwl, 12000 + Math.random() * 13000);
  }

  function fireCrystal() {
    if (!playing || !state.crystal || !master) return;
    const now = ctx.currentTime;
    const scale = [261.6, 293.7, 329.6, 369.9, 415.3, 466.2, 523.3, 587.3];
    const note = scale[Math.floor(Math.random() * scale.length)];
    const rev = mkRev(7, 1.3);
    const rG = ctx.createGain();
    rG.gain.setValueAtTime(0.9, now);
    rev.connect(rG);
    rG.connect(master);
    
    [1, 2, 3].forEach((ratio, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(note * ratio, now);
      
      const env = ctx.createGain();
      const vol = [0.065, 0.022, 0.007][i];
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(vol, now + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 5.5 + i * 1.8);
      
      o.connect(env);
      env.connect(rev);
      env.connect(master!);
      
      o.start(now);
      o.stop(now + 8);
    });
    
    crystalTimer = setTimeout(fireCrystal, 9000 + Math.random() * 11000);
  }

  const controller: SoundscapeController = {
    start: () => {
      if (playing) return;
      playing = true;

      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.93;

      master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      master.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 5);

      makeBreath();
      makeWind();
      setTimeout(fireOwl, 6000);
      setTimeout(fireCrystal, 4000);
    },
    stop: () => {
      if (!playing) return;
      playing = false;

      if (owlTimer) clearTimeout(owlTimer);
      if (crystalTimer) clearTimeout(crystalTimer);

      if (master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
      }

      Object.values(nodes).forEach((n) => {
        if (n.oscs)
          n.oscs.forEach((o) => {
            try {
              if (o instanceof OscillatorNode) o.stop(ctx.currentTime + 3);
            } catch (e) {}
          });
        if (n.src)
          try {
            n.src.stop(ctx.currentTime + 3);
          } catch (e) {}
      });

      // Clean up after fade
      setTimeout(() => {
        Object.keys(nodes).forEach((k) => delete nodes[k]);
      }, 3000);
    },
    setVolume: (v: number) => {
      if (master)
        master.gain.linearRampToValueAtTime(v / 100, ctx.currentTime + 0.15);
    },
    toggleLayer: (name: keyof SoundscapeState, enabled: boolean) => {
      state[name] = enabled;
      if (!playing || !nodes[name]) return;

      const targets = { breath: 0.2, wind: 0.05, owl: 0, crystal: 0 };
      const t = enabled ? targets[name as keyof typeof targets] : 0;

      if (nodes[name].gain) {
        nodes[name].gain.gain.linearRampToValueAtTime(t, ctx.currentTime + 2.5);
      }
    },
    getAnalyser: () => analyser,
  };

  return controller;
}

/**
 * Individual Sound Effects (One-shots)
 */

export function playHayaHoot(ctx: AudioContext, destination: AudioNode) {
  const now = ctx.currentTime;
  const base = 170 + Math.random() * 50;
  const rev = ctx.createConvolver(); // Simplified for one-shot or reuse
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.08, now + 0.2);
  env.gain.setValueAtTime(0.08, now + 0.52);
  env.gain.linearRampToValueAtTime(0, now + 1.1);

  [1, 1.99].forEach((ratio) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(base * ratio * 1.04, now);
    o.frequency.linearRampToValueAtTime(base * ratio * 0.96, now + 1.1);
    o.connect(env);
    o.start(now);
    o.stop(now + 1.25);
  });

  env.connect(destination);
}

export function playHayaCrystal(ctx: AudioContext, destination: AudioNode) {
  const now = ctx.currentTime;
  const scale = [261.6, 329.6, 392.0, 523.3, 659.3];
  const note = scale[Math.floor(Math.random() * scale.length)];

  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(note, now);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.05, now + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 4);

  o.connect(env);
  env.connect(destination);
  o.start(now);
  o.stop(now + 4.1);
}

export function playUIWhoosh(ctx: AudioContext, destination: AudioNode) {
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(100, now);
  o.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.1, now + 0.05);
  g.gain.linearRampToValueAtTime(0, now + 0.2);
  o.connect(g);
  g.connect(destination);
  o.start(now);
  o.stop(now + 0.2);
}

export function playUIClick(ctx: AudioContext, destination: AudioNode) {
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(150, now);
  o.frequency.exponentialRampToValueAtTime(50, now + 0.05);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.05, now + 0.005);
  g.gain.linearRampToValueAtTime(0, now + 0.05);
  o.connect(g);
  g.connect(destination);
  o.start(now);
  o.stop(now + 0.05);
}
