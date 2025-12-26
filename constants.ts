
import { BreathingMode } from './types';

export const MODES: BreathingMode[] = [
  {
    id: 'deep',
    name: 'Глубокое дыхание',
    description: 'Балансирует нервную систему. Положите руку на живот и дышите так, чтобы живот поднимался и опускался',
    pattern: [
      { duration: 5, text: 'глубокий вдох', scale: 1.5, ringScale: 1.5 },
      { duration: 5, text: 'глубокий выдох ртом', scale: 1.0, ringScale: 1.0 }
    ]
  },
  {
    id: 'box',
    name: 'Дыхание квадратом',
    description: 'Помогает справиться с тревогой и стрессом. Приводит мысли в порядок',
    pattern: [
      { duration: 4, text: 'глубокий вдох', scale: 1.5, ringScale: 1.5 },
      { duration: 4, text: 'задержка', scale: 1.5, ringScale: 1.0 },
      { duration: 4, text: 'глубокий выдох ртом', scale: 1.0, ringScale: 1.0 },
      { duration: 4, text: 'задержка', scale: 1.0, ringScale: 1.0 }
    ]
  },
  {
    id: '478',
    name: 'Дыхание 4-7-8',
    description: 'Помогает заснуть расслабляя тело и ум. Сбалансировать кровяное давление',
    pattern: [
      { duration: 4, text: 'вдох', scale: 1.5, ringScale: 1.5 },
      { duration: 7, text: 'задержка', scale: 1.5, ringScale: 1.0 },
      { duration: 8, text: 'выдох', scale: 1.0, ringScale: 1.0 }
    ]
  },
  {
    id: 'panic',
    name: 'При панических атаках',
    description: 'Экстренная помощь для успокоения сердцебиения и снятия острого стресса',
    pattern: [
      { duration: 3, text: 'короткий вдох', scale: 1.3, ringScale: 1.3 },
      { duration: 6, text: 'длинный выдох', scale: 1.0, ringScale: 1.0 }
    ]
  }
];

export const TIMER_OPTIONS = [60, 180, 300, 600];
