import React from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

type ThemedSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackOn: string;
  trackOff: string;
  thumbOn: string;
  thumbOff: string;
  darkMode?: boolean;
};

export default function ThemedSwitch({
  value,
  onValueChange,
  trackOn,
  trackOff,
  thumbOn,
  thumbOff,
  darkMode = false,
}: ThemedSwitchProps) {
  if (Platform.OS === 'web') {
    return (
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        onPress={() => onValueChange(!value)}
        style={[styles.webTrack, { backgroundColor: value ? trackOn : trackOff }]}
      >
        <View
          style={[
            styles.webThumb,
            { backgroundColor: value ? thumbOn : thumbOff },
            !value && !darkMode ? styles.webThumbShadowLight : null,
            value ? styles.webThumbOn : styles.webThumbOff,
          ]}
        />
      </Pressable>
    );
  }

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: trackOff, true: trackOn }}
      thumbColor={value ? thumbOn : thumbOff}
      style={styles.nativeSwitch}
    />
  );
}

const styles = StyleSheet.create({
  nativeSwitch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  webTrack: {
    width: 34,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  webThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  webThumbShadowLight: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
    elevation: 2,
  },
  webThumbOff: {
    marginLeft: 0,
  },
  webThumbOn: {
    marginLeft: 14,
  },
});
