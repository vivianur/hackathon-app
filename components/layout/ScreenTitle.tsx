import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useAdaptiveTheme } from '@/hooks';

type ScreenTitleProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle?: string;
  iconSize?: number;
};

export default function ScreenTitle({ icon, title, subtitle, iconSize = 28 }: ScreenTitleProps) {
  const { ui } = useAdaptiveTheme();

  return (
    <>
      <View style={styles.titleRow}>
        <MaterialIcons name={icon} size={iconSize} color={ui.colors.accent} />
        <Text style={[styles.title, { color: ui.colors.textPrimary, fontSize: ui.typography.h1 }]}>{title}</Text>
      </View>
      {subtitle && ui.content.showSecondaryText ? (
        <Text style={[styles.subtitle, { color: ui.colors.textSecondary, fontSize: ui.typography.body }]}>{subtitle}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subtitle: {
    lineHeight: 20,
  },
});
