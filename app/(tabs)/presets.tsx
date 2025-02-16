import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import useTimerStore from '../../store/timerStore';
import useThemeStore from '../../store/themeStore';
import { TimerPreset, TimerSegment } from '../../types/timer';

const SegmentEditor = React.memo(({ 
  item, 
  index, 
  onUpdateSegment, 
  onRemoveSegment, 
  onMoveSegment 
}: {
  item: TimerSegment;
  index: number;
  onUpdateSegment: (index: number, updates: Partial<TimerSegment>) => void;
  onRemoveSegment: (index: number) => void;
  onMoveSegment: (from: number, to: number) => void;
}) => {
  const { currentTheme } = useThemeStore();
  const position = useSharedValue(0);
  const isMoving = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isMoving.value = true;
    })
    .onUpdate((event) => {
      position.value = event.translationY;
    })
    .onEnd(() => {
      position.value = withSpring(0);
      isMoving.value = false;
      
      const newIndex = Math.max(0, Math.min(
        index + Math.round(position.value / 60)
      ));
      
      if (newIndex !== index) {
        onMoveSegment(index, newIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
    zIndex: isMoving.value ? 1 : 0,
    backgroundColor: withTiming(
      index % 2 === 0 
        ? currentTheme.colors.background.secondary
        : currentTheme.colors.background.primary,
      { duration: 200 }
    ),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.segmentEditor, animatedStyle]}>
        <View style={styles.segmentDragHandle}>
          <Ionicons name="menu" size={24} color={currentTheme.colors.text.secondary} />
        </View>
        
        <View style={styles.segmentFields}>
          <TextInput
            style={[styles.segmentInput, { color: currentTheme.colors.text.primary }]}
            value={item.name}
            onChangeText={(text) => onUpdateSegment(index, { name: text })}
            placeholder="Segment Name"
            placeholderTextColor={currentTheme.colors.text.secondary}
          />
          
          <View style={styles.segmentDuration}>
            <TextInput
              style={[styles.durationInput, { color: currentTheme.colors.text.primary }]}
              value={item.duration.toString()}
              onChangeText={(text) => {
                const duration = parseInt(text) || 1;
                onUpdateSegment(index, { duration });
              }}
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={[styles.durationLabel, { color: currentTheme.colors.text.secondary }]}>min</Text>
          </View>
        </View>

        <Pressable
          style={styles.removeSegment}
          onPress={() => onRemoveSegment(index)}
        >
          <Ionicons name="close-circle" size={24} color="#FF3B30" />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
});

const PresetItem = React.memo(({ 
  item,
  onPress,
  onEdit,
  onDuplicate,
  onDelete 
}: {
  item: TimerPreset;
  onPress: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) => {
  const { currentTheme } = useThemeStore();

  return (
    <Pressable
      style={[styles.presetItem, { backgroundColor: currentTheme.colors.background.secondary }]}
      onPress={onPress}
    >
      <View style={styles.presetInfo}>
        <Text style={[styles.presetName, { color: currentTheme.colors.text.primary }]}>
          {item.name}
        </Text>
        <Text style={[styles.presetDetails, { color: currentTheme.colors.text.secondary }]}>
          {item.segments.length} segments • {item.loop ? 'Loop' : 'Once'}
        </Text>
        
        <View style={styles.segmentPills}>
          {item.segments.map((segment, index) => (
            <View
              key={segment.id}
              style={[styles.segmentPill, { backgroundColor: segment.color }]}
            >
              <Text style={styles.segmentPillText}>
                {segment.name} ({segment.duration}m)
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.presetActions}>
        <Pressable
          style={styles.actionButton}
          onPress={onEdit}
        >
          <Ionicons name="pencil" size={20} color={currentTheme.colors.primary} />
        </Pressable>
        
        <Pressable
          style={styles.actionButton}
          onPress={onDuplicate}
        >
          <Ionicons name="copy" size={20} color={currentTheme.colors.primary} />
        </Pressable>
        
        <Pressable
          style={styles.actionButton}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </Pressable>
      </View>
    </Pressable>
  );
});

export default function PresetsScreen() {
  const { currentTheme } = useThemeStore();
  const { presets, addPreset, removePreset, updatePreset, setActivePreset } = useTimerStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPreset, setEditingPreset] = useState<TimerPreset | null>(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [segments, setSegments] = useState<TimerSegment[]>([]);
  const [loop, setLoop] = useState(true);

  const handleCreatePreset = () => {
    if (newPresetName.trim()) {
      addPreset({
        name: newPresetName,
        segments: [
          {
            id: '1',
            name: 'Focus',
            duration: 25,
            color: currentTheme.colors.timer.focus,
          },
          {
            id: '2',
            name: 'Break',
            duration: 5,
            color: currentTheme.colors.timer.shortBreak,
          },
        ],
        loop: true,
      });
      setNewPresetName('');
      setIsCreating(false);
    }
  };

  const handleEditPreset = (preset: TimerPreset) => {
    setEditingPreset(preset);
    setNewPresetName(preset.name);
    setSegments([...preset.segments]);
    setLoop(preset.loop);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingPreset && newPresetName.trim()) {
      updatePreset({
        ...editingPreset,
        name: newPresetName,
        segments: segments.map((segment, index) => ({
          ...segment,
          color: currentTheme.colors.timer.custom[index % currentTheme.colors.timer.custom.length],
        })),
        loop,
      });
      setIsEditing(false);
      setEditingPreset(null);
      setNewPresetName('');
      setSegments([]);
    }
  };

  const handleDuplicatePreset = (preset: TimerPreset) => {
    addPreset({
      name: `${preset.name} (Copy)`,
      segments: [...preset.segments],
      loop: preset.loop,
    });
  };

  const renderItem = React.useCallback(({ item }: { item: TimerPreset }) => (
    <PresetItem
      item={item}
      onPress={() => setActivePreset(item)}
      onEdit={() => handleEditPreset(item)}
      onDuplicate={() => handleDuplicatePreset(item)}
      onDelete={() => removePreset(item.id)}
    />
  ), [setActivePreset, handleEditPreset, handleDuplicatePreset, removePreset]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background.primary }]}>
      <Text style={[styles.title, { color: currentTheme.colors.text.primary }]}>Timer Presets</Text>
      
      {!isEditing && (
        <Pressable
          style={[styles.addButton, { backgroundColor: currentTheme.colors.background.secondary }]}
          onPress={() => setIsCreating(true)}
        >
          <Ionicons name="add" size={24} color={currentTheme.colors.text.primary} />
          <Text style={[styles.addButtonText, { color: currentTheme.colors.text.primary }]}>
            New Preset
          </Text>
        </Pressable>
      )}

      {!isEditing && (
        <FlatList
          data={presets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}

      <Modal
        visible={isCreating || isEditing}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.colors.background.secondary }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text.primary }]}>
              {isEditing ? 'Edit Preset' : 'New Preset'}
            </Text>

            <TextInput
              style={[styles.input, { 
                backgroundColor: currentTheme.colors.background.primary,
                color: currentTheme.colors.text.primary 
              }]}
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="Preset Name"
              placeholderTextColor={currentTheme.colors.text.secondary}
            />

            {isEditing && (
              <>
                <View style={styles.segmentsList}>
                  <FlatList
                    data={segments}
                    renderItem={({ item, index }) => (
                      <SegmentEditor
                        item={item}
                        index={index}
                        onUpdateSegment={(index, updates) => {
                          const newSegments = [...segments];
                          newSegments[index] = { 
                            ...newSegments[index], 
                            ...updates,
                            color: currentTheme.colors.timer.custom[index % currentTheme.colors.timer.custom.length],
                          };
                          setSegments(newSegments);
                        }}
                        onRemoveSegment={(index) => {
                          setSegments(segments.filter((_, i) => i !== index));
                        }}
                        onMoveSegment={(from, to) => {
                          const newSegments = [...segments];
                          const [removed] = newSegments.splice(from, 1);
                          newSegments.splice(to, 0, removed);
                          setSegments(newSegments.map((segment, index) => ({
                            ...segment,
                            color: currentTheme.colors.timer.custom[index % currentTheme.colors.timer.custom.length],
                          })));
                        }}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </View>

                <Pressable
                  style={[styles.addSegmentButton, { backgroundColor: currentTheme.colors.background.primary }]}
                  onPress={() => {
                    const newSegment: TimerSegment = {
                      id: Date.now().toString(),
                      name: 'New Segment',
                      duration: 25,
                      color: currentTheme.colors.timer.custom[segments.length % currentTheme.colors.timer.custom.length],
                    };
                    setSegments([...segments, newSegment]);
                  }}
                >
                  <Ionicons name="add" size={20} color={currentTheme.colors.text.primary} />
                  <Text style={[styles.addSegmentText, { color: currentTheme.colors.text.primary }]}>
                    Add Segment
                  </Text>
                </Pressable>

                <View style={styles.loopSetting}>
                  <Text style={[styles.loopLabel, { color: currentTheme.colors.text.primary }]}>
                    Loop Timer
                  </Text>
                  <Switch
                    value={loop}
                    onValueChange={setLoop}
                    trackColor={{ 
                      false: currentTheme.colors.background.primary, 
                      true: currentTheme.colors.primary 
                    }}
                  />
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton, { 
                  backgroundColor: currentTheme.colors.background.primary 
                }]}
                onPress={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setEditingPreset(null);
                  setNewPresetName('');
                  setSegments([]);
                }}
              >
                <Text style={[styles.buttonText, { color: currentTheme.colors.text.primary }]}>
                  Cancel
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.button, styles.createButton, { 
                  backgroundColor: currentTheme.colors.primary 
                }]}
                onPress={isEditing ? handleSaveEdit : handleCreatePreset}
              >
                <Text style={styles.buttonText}>
                  {isEditing ? 'Save' : 'Create'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  presetItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 18,
    fontWeight: '600',
  },
  presetDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  segmentPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  segmentPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  segmentPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  presetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  segmentsList: {
    maxHeight: 400,
  },
  segmentEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  segmentDragHandle: {
    padding: 8,
  },
  segmentFields: {
    flex: 1,
    marginHorizontal: 10,
  },
  segmentInput: {
    fontSize: 16,
    marginBottom: 4,
  },
  segmentDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationInput: {
    fontSize: 16,
    width: 50,
    textAlign: 'right',
  },
  durationLabel: {
    marginLeft: 4,
  },
  removeSegment: {
    padding: 8,
  },
  addSegmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
  },
  addSegmentText: {
    fontSize: 16,
    marginLeft: 8,
  },
  loopSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loopLabel: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});