class AudioService {
  private rainAudio: HTMLAudioElement | null = null;
  private inhaleAudio: HTMLAudioElement | null = null;
  private exhaleAudio: HTMLAudioElement | null = null;
  private gongAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Убрали точку в начале, так надежнее для Vercel
    const basePath = 'sounds/'; 

    this.rainAudio = new Audio(`${basePath}rain.mp3`);
    this.rainAudio.loop = true; 
    this.rainAudio.volume = 1.0; 

    this.inhaleAudio = new Audio(`${basePath}inhale.mp3`);
    this.inhaleAudio.volume = 1.0;

    // ВАЖНО: preload="auto" подсказывает браузеру грузить сразу
    this.exhaleAudio = new Audio(`${basePath}exhale.mp3`);
    this.exhaleAudio.preload = 'auto'; 
    this.exhaleAudio.volume = 1.0;
    
    this.gongAudio = new Audio(`${basePath}gong.mp3`);
    this.gongAudio.volume = 0.6;
  }

  // 👇 ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ
  // Мы "прогреваем" все звуки при первом клике
  unlock() {
    const sounds = [this.inhaleAudio, this.exhaleAudio, this.gongAudio, this.rainAudio];

    sounds.forEach(sound => {
      if (sound) {
        // 1. Делаем звук беззвучным
        const originalVolume = sound.volume;
        sound.volume = 0;
        
        // 2. Запускаем воспроизведение
        sound.play().then(() => {
            // 3. Сразу ставим на паузу и возвращаем в начало
            sound.pause();
            sound.currentTime = 0;
            // 4. Возвращаем громкость
            sound.volume = originalVolume;
        }).catch((e) => {
            console.log('Warmup failed for a sound', e);
        });
      }
    });
  }

  playRain() {
    if (this.rainAudio && !this.isMuted) {
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