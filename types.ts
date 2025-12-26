
export enum AppStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  OVERTIME = 'OVERTIME'
}

export interface Phase {
  duration: number; // in seconds
  text: string;
  scale: number;
  ringScale: number;
}

export interface BreathingMode {
  id: string;
  name: string;
  description: string;
  pattern: Phase[];
}

export interface AppState {
  status: AppStatus;
  currentModeId: string;
  sessionTimeLeft: number; // in seconds
  totalSessionTime: number; // total chosen time
}
