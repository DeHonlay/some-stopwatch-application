import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerPreset, TimerState, TimerSegment } from '../types/timer';

interface TimerStore extends TimerState {
  presets: TimerPreset[];
  addPreset: (preset: Omit<TimerPreset, 'id'>) => void;
  removePreset: (id: string) => void;
  updatePreset: (preset: TimerPreset) => void;
  setActivePreset: (preset: TimerPreset | null) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

const useTimerStore = create<TimerStore>((set, get) => ({
  isRunning: false,
  currentSegmentIndex: 0,
  timeRemaining: 0,
  activePreset: null,
  presets: [],

  addPreset: async (preset) => {
    const newPreset: TimerPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    set((state) => ({
      presets: [...state.presets, newPreset],
    }));
    await AsyncStorage.setItem('presets', JSON.stringify(get().presets));
  },

  removePreset: async (id) => {
    set((state) => ({
      presets: state.presets.filter((preset) => preset.id !== id),
    }));
    await AsyncStorage.setItem('presets', JSON.stringify(get().presets));
  },

  updatePreset: async (preset) => {
    set((state) => ({
      presets: state.presets.map((p) => (p.id === preset.id ? preset : p)),
    }));
    await AsyncStorage.setItem('presets', JSON.stringify(get().presets));
  },

  setActivePreset: (preset) => {
    set({
      activePreset: preset,
      currentSegmentIndex: 0,
      timeRemaining: preset ? preset.segments[0].duration * 60 : 0,
      isRunning: false,
    });
  },

  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const { activePreset } = get();
    if (activePreset) {
      set({
        isRunning: false,
        currentSegmentIndex: 0,
        timeRemaining: activePreset.segments[0].duration * 60,
      });
    }
  },

  tick: () => {
    const { timeRemaining, currentSegmentIndex, activePreset, isRunning } = get();
    if (!isRunning || !activePreset) return;

    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      const nextSegmentIndex = currentSegmentIndex + 1;
      if (nextSegmentIndex < activePreset.segments.length) {
        set({
          currentSegmentIndex: nextSegmentIndex,
          timeRemaining: activePreset.segments[nextSegmentIndex].duration * 60,
        });
      } else if (activePreset.loop) {
        set({
          currentSegmentIndex: 0,
          timeRemaining: activePreset.segments[0].duration * 60,
        });
      } else {
        set({ isRunning: false });
      }
    }
  },
}));

export default useTimerStore;