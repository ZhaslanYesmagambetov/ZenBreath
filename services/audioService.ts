class AudioService {
  private rainAudio: HTMLAudioElement | null = null;
  private inhaleAudio: HTMLAudioElement | null = null;
  private exhaleAudio: HTMLAudioElement | null = null;
  private gongAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    const basePath = 'sounds/'; 

    this.rainAudio = new Audio(`${basePath}rain.mp3`);
    this.rainAudio.loop = true; 
    this.rainAudio.volume = 1.0; 

    this.inhaleAudio = new Audio(`${basePath}inhale.mp3`);
    this.inhaleAudio.volume = 1.0;

    // preload="auto" нужен для отложенных звуков
    this.exhaleAudio = new Audio(`${basePath}exhale.mp3`);
    this.exhaleAudio.preload = 'auto'; 
    this.exhaleAudio.volume = 1.0;
    
    this.gongAudio = new Audio(`${basePath}gong.mp3`);
    this.gongAudio.volume = 0.6;
  }

  // 👇 ИСПРАВЛЕНИЕ ЗДЕСЬ
  unlock() {
    // Мы убрали inhaleAudio и rainAudio из этого списка.
    // Они стартуют мгновенно при клике, им не нужен "фейковый" запуск.
    // Если мы их тут тронем, мы собьем их настоящий старт.
    const sounds = [this.exhaleAudio, this.gongAudio];

    sounds.forEach(sound => {
      if (sound) {
        const originalVolume = sound.volume;
        sound.volume = 0;
        
        sound.play().then(() => {
            sound.pause();
            sound.currentTime = 0;
            sound.volume = originalVolume;
        }).catch((e) => {
            console.log('Warmup failed', e);
        });
      }
    });
  }

  playRain() {
    if (this.rainAudio && !this.isMuted) {
      // Android любит, когда play вызывается явно
      this.rainAudio.play().catch(e => console.error('Rain error:', e));
    }
  }

  stopRain() {
    if (this.rainAudio) {
      this.rainAudio.pause();
      this.rainAudio.currentTime = 0;
    }
  }

  playInhale() {
    if (this.inhaleAudio && !this.isMuted) {
      this.inhaleAudio.currentTime = 0; 
      this.inhaleAudio.play().catch(e => console.error('Inhale error:', e));
    }
  }

  playExhale() {
    if (this.exhaleAudio && !this.isMuted) {
      this.exhaleAudio.currentTime = 0;
      this.exhaleAudio.play().catch(e => console.error('Exhale error:', e));
    }
  }

  playGong() {
    if (this.gongAudio && !this.isMuted) {
      this.gongAudio.currentTime = 0; 
      this.gongAudio.play().catch(e => console.error('Gong error:', e));
    }
  }
}

export const audioService = new AudioService();