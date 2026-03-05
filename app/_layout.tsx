import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import VLibrasWidget from '@/components/VLibrasWidget';
import { SettingsProvider, useSettings } from '@/hooks';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { settings } = useSettings();
  const isDarkMode = settings.darkMode;

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <VLibrasWidget />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <RootNavigator />
    </SettingsProvider>
  );
}
