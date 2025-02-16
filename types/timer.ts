export interface TimerSegment {
  id: string;
  name: string;
  duration: number; // in minutes
  color: string;
}

export interface TimerPreset {
  id: string;
  name: string;
  segments: TimerSegment[];
  loop: boolean;
}

export interface TimerState {
  isRunning: boolean;
  currentSegmentIndex: number;
  timeRemaining: number;
  activePreset: TimerPreset | null;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';