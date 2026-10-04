// Audio Engine with Web Audio API Synthesizer & Speech Synthesis

class BGMPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.25;
  private timerId: number | null = null;
  private currentTrack = 0;
  private noteIndex = 0;

  // Cheerful pentatonic & major melodies for primary school kids
  private tracks = [
    {
      name: 'Sunny Playground 阳光操场',
      tempo: 160,
      notes: [
        // C5, E5, G5, A5, G5, E5, D5, C5
        523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25,
        659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 587.33,
        523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0, 523.25,
        587.33, 659.25, 587.33, 523.25, 659.25, 783.99, 1046.5, 783.99,
      ],
      bass: [261.63, 329.63, 392.0, 440.0],
    },
    {
      name: 'Little Detective 小侦探进行曲',
      tempo: 140,
      notes: [
        440.0, 493.88, 523.25, 587.33, 659.25, 523.25, 587.33, 440.0,
        523.25, 587.33, 659.25, 783.99, 880.0, 659.25, 587.33, 523.25,
        440.0, 523.25, 659.25, 587.33, 493.88, 440.0, 392.0, 440.0,
      ],
      bass: [220.0, 261.63, 329.63, 293.66],
    },
    {
      name: 'Happy Melody 奇趣律动',
      tempo: 175,
      notes: [
        587.33, 659.25, 783.99, 880.0, 987.77, 880.0, 783.99, 659.25,
        587.33, 783.99, 987.77, 1174.66, 987.77, 783.99, 659.25, 587.33,
      ],
      bass: [293.66, 392.0, 493.88, 392.0],
    },
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playNextTick();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public switchTrack(trackIdx: number) {
    this.currentTrack = trackIdx % this.tracks.length;
    this.noteIndex = 0;
  }

  public getTracks() {
    return this.tracks.map((t, i) => ({ id: i, name: t.name }));
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrack;
  }

  private playNextTick() {
    if (!this.isPlaying || !this.ctx) return;

    const track = this.tracks[this.currentTrack];
    const noteFreq = track.notes[this.noteIndex % track.notes.length];
    const bassFreq = track.bass[Math.floor(this.noteIndex / 4) % track.bass.length];

    if (!this.isMuted && this.volume > 0.01) {
      this.playSynthNote(noteFreq, 0.18, this.volume * 0.45, 'triangle');
      // Gentle soft warm chime every 2 beats
      if (this.noteIndex % 2 === 0) {
        this.playSynthNote(noteFreq * 0.5, 0.28, this.volume * 0.2, 'sine');
      }
      // Warm bass support on downbeats
      if (this.noteIndex % 4 === 0) {
        this.playSynthNote(bassFreq * 0.5, 0.4, this.volume * 0.3, 'sine');
      }
    }

    this.noteIndex = (this.noteIndex + 1) % track.notes.length;
    const intervalMs = (60 / track.tempo) * 1000 * 0.5;

    this.timerId = window.setTimeout(() => {
      this.playNextTick();
    }, intervalMs);
  }

  private playSynthNote(freq: number, duration: number, gainVal: number, type: OscillatorType = 'triangle') {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Sound Effects for Game
  public playSfx(type: 'pop' | 'correct' | 'wrong' | 'celebration' | 'magic') {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      if (type === 'pop') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'correct') {
        // Joyful 3-note arpeggio C6 - E6 - G6
        [1046.5, 1318.51, 1567.98].forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.07);
          gain.gain.setValueAtTime(0.001, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.25);
        });
      } else if (type === 'wrong') {
        // Gentle boing
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'celebration') {
        // Fanfare
        [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      } else if (type === 'magic') {
        // Sparkle glissando
        for (let i = 0; i < 5; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700 + i * 220, now + i * 0.04);
          gain.gain.setValueAtTime(0.08, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.12);
        }
      }
    } catch {
      // Ignored
    }
  }
}

export const bgm = new BGMPlayer();

// Native Speech Synthesis with kid-friendly slow/clear voice
export function speakWord(text: string, rate: number = 0.88) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    bgm.playSfx('pop');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // cancel pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // slightly slower for young learners
    utterance.pitch = 1.05; // warm, friendly tone

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Junior'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    bgm.playSfx('pop');
  }
}
