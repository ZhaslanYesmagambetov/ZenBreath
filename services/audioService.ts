class AudioService {
  private rainAudio: HTMLAudioElement | null = null;
  private inhaleAudio: HTMLAudioElement | null = null;
  private exhaleAudio: HTMLAudioElement | null = null;
  private gongAudio: HTMLAudioElement | null = null; // 1. Новая переменная
  private isMuted: boolean = false;

  constructor() {
    this.rainAudio = new Audio('./sounds/rain.mp3');
    this.rainAudio.loop = true; 
    this.rainAudio.volume = 0.5;

    this.inhaleAudio = new Audio('./sounds/inhale.mp3');
    this.inhaleAudio.volume = 1.0;

    this.exhaleAudio = new Audio('./sounds/exhale.mp3');
    this.exhaleAudio.volume = 1.0;
    
    // 2. Загружаем гонг
    this.gongAudio = new Audio('./sounds/gong.mp3');
    this.gongAudio.volume = 0.6; // Не слишком громко
  }

  unlock() {
    const empty = new Audio();
    empty.play().catch(() => {});
  }

  playRain() {
    if (this.rainAudio && !this.isMuted) {
      this.rainAudio.play().catch(e => console.warn("Audio play failed", e));
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
      this.inhaleAudio.play().catch(() => {});
    }
  }

  playExhale() {
    if (this.exhaleAudio && !this.isMuted) {
      this.exhaleAudio.currentTime = 0;
      this.exhaleAudio.play().catch(() => {});
    }
  }

  // 3. Метод воспроизведения гонга
  playGong() {
    if (this.gongAudio && !this.isMuted) {
      this.gongAudio.currentTime = 0; // Сброс, чтобы можно было бить часто
      this.gongAudio.play().catch(() => {});
    }
  }
}

export const audioService = new AudioService();