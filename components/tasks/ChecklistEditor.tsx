import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAdaptiveTheme } from '@/hooks';

type ChecklistEditorProps = {
  enabled: boolean;
  checklistLabels: readonly string[];
  onToggle: () => void;
};

export default function ChecklistEditor({
  enabled,
  checklistLabels,
  onToggle,
}: ChecklistEditorProps) {
  const { ui } = useAdaptiveTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: ui.colors.border,
          borderWidth: ui.borders.width,
          borderRadius: ui.shape.radius,
          backgroundColor: ui.colors.surface,
        },
      ]}>
      <Pressable onPress={onToggle} style={styles.toggleRow}>
        <MaterialIcons
          name={enabled ? 'check-box' : 'check-box-outline-blank'}
          size={20}
          color={ui.colors.accent}
        />
        <View style={styles.copy}>
          <Text
            style={[
              styles.title,
              { color: ui.colors.textPrimary, fontSize: ui.typography.body },
            ]}>
            Adicionar checklist guiado
          </Text>
          <Text
            style={[
              styles.description,
              { color: ui.colors.textSecondary, fontSize: ui.typography.small },
            ]}>
            Cria etapas visuais para reduzir sobrecarga na execucao da tarefa.
          </Text>
        </View>
      </Pressable>

      {enabled ? (
        <View style={styles.preview}>
          {checklistLabels.map((label) => (
            <View key={label} style={styles.previewItem}>
              <MaterialIcons name="subdirectory-arrow-right" size={16} color={ui.colors.accent} />
              <Text
                style={[
                  styles.previewText,
                  { color: ui.colors.textPrimary, fontSize: ui.typography.small },
                ]}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '700',
  },
  description: {},
  preview: {
    gap: 6,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewText: {
    flex: 1,
  },
});
