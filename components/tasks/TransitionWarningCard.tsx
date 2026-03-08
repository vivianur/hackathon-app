import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAdaptiveTheme } from '@/hooks';

type TransitionWarningCardProps = {
  message: string;
  onDismiss: () => void;
};

export default function TransitionWarningCard({
  message,
  onDismiss,
}: TransitionWarningCardProps) {
  const { ui } = useAdaptiveTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: ui.colors.border,
          borderWidth: ui.borders.width,
          borderRadius: ui.shape.radius,
          backgroundColor: ui.mode.monochrome ? ui.colors.surface : '#fff4d6',
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons name="timelapse" size={18} color={ui.colors.accent} />
          <Text
            style={[
              styles.title,
              { color: ui.colors.textPrimary, fontSize: ui.typography.body },
            ]}>
            Aviso de transicao
          </Text>
        </View>
        <Pressable onPress={onDismiss}>
          <MaterialIcons name="close" size={18} color={ui.colors.textSecondary} />
        </Pressable>
      </View>

      <Text
        style={[
          styles.message,
          { color: ui.colors.textPrimary, fontSize: ui.typography.small },
        ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontWeight: '700',
  },
  message: {
    lineHeight: 20,
  },
});
