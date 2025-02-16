import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface TimerDisplayProps {
  timeRemaining: number;
  segmentName: string;
  color: string;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerDisplay({
  timeRemaining,
  segmentName,
  color,
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerDisplayProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(color, { duration: 500 }),
  }));

  return (
    <Animated.View style={[styles.container, backgroundStyle]}>
      <Text style={styles.segmentName}>{segmentName}</Text>
      <Text style={styles.timer}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      
      <View style={styles.controls}>
        <Pressable onPress={onReset} style={styles.controlButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </Pressable>
        
        <Pressable
          onPress={isRunning ? onPause : onStart}
          style={[styles.controlButton, styles.mainButton]}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={32}
            color="white"
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  segmentName: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: '600',
  },
  timer: {
    fontSize: 72,
    color: 'white',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
  },
  controlButton: {
    padding: 15,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  mainButton: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});