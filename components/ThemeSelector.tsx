import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Theme, themes } from '../types/theme';
import useThemeStore from '../store/themeStore';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const ThemePreview = ({ theme }: { theme: Theme }) => {
  const { width } = useWindowDimensions();
  const previewWidth = width * 0.4;

  return (
    <View style={[styles.themePreview, { width: previewWidth }]}>
      <View style={[
        styles.previewHeader,
        { backgroundColor: theme.colors.background.secondary }
      ]}>
        <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>
          {theme.name}
        </Text>
      </View>
      
      <View style={[
        styles.previewContent,
        { backgroundColor: theme.colors.background.primary }
      ]}>
        <View style={styles.colorGrid}>
          {[
            theme.colors.primary,
            theme.colors.secondary,
            theme.colors.accent,
            ...theme.colors.timer.custom,
          ].map((color, index) => (
            <View
              key={index}
              style={[styles.colorSwatch, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: currentTheme.colors.text.primary }
      ]}>
        Theme
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themesContainer}
      >
        {themes.map((theme) => (
          <Pressable
            key={theme.id}
            onPress={() => setTheme(theme.id)}
            style={[
              styles.themeButton,
              currentTheme.id === theme.id && styles.selectedTheme,
            ]}
          >
            <ThemePreview theme={theme} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  themesContainer: {
    paddingHorizontal: 10,
    gap: 15,
  },
  themeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  themePreview: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewHeader: {
    padding: 10,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewContent: {
    flex: 1,
    padding: 10,
  },
  colorGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});