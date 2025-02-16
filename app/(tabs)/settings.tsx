import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemeSelector from '../../components/ThemeSelector';
import useThemeStore from '../../store/themeStore';

export default function SettingsScreen() {
  const { currentTheme } = useThemeStore();
  const theme = currentTheme.colors;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text.primary }]}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
          Notifications
        </Text>
        <View style={[
          styles.setting,
          { borderBottomColor: theme.background.secondary }
        ]}>
          <Text style={[styles.settingText, { color: theme.text.primary }]}>
            Sound
          </Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: theme.background.secondary, true: theme.primary }}
          />
        </View>
        <View style={[
          styles.setting,
          { borderBottomColor: theme.background.secondary }
        ]}>
          <Text style={[styles.settingText, { color: theme.text.primary }]}>
            Vibration
          </Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: theme.background.secondary, true: theme.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
          Appearance
        </Text>
        <ThemeSelector />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
          About
        </Text>
        <View style={[
          styles.setting,
          { borderBottomColor: theme.background.secondary }
        ]}>
          <Text style={[styles.settingText, { color: theme.text.primary }]}>
            Version
          </Text>
          <Text style={[styles.settingValue, { color: theme.text.secondary }]}>
            1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
});