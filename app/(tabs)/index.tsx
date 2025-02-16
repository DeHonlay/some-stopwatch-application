import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TimerDisplay from '../../components/Timer/TimerDisplay';
import useTimerStore from '../../store/timerStore';

export default function TimerScreen() {
  const {
    activePreset,
    currentSegmentIndex,
    timeRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
  } = useTimerStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  if (!activePreset) {
    return (
      <View style={styles.container}>
        <TimerDisplay
          timeRemaining={0}
          segmentName="No Timer Selected"
          color="#1a1a1a"
          isRunning={false}
          onStart={() => {}}
          onPause={() => {}}
          onReset={() => {}}
        />
      </View>
    );
  }

  const currentSegment = activePreset.segments[currentSegmentIndex];

  return (
    <View style={styles.container}>
      <TimerDisplay
        timeRemaining={timeRemaining}
        segmentName={currentSegment.name}
        color={currentSegment.color}
        isRunning={isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});