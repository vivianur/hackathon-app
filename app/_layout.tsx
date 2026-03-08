import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import InlineFeedbackBanner from '@/components/ui/InlineFeedbackBanner';
import VLibrasWidget from '@/components/VLibrasWidget';
import { FeedbackProvider, SettingsProvider, useSettings } from '@/hooks';

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
      <InlineFeedbackBanner />
      <VLibrasWidget />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FeedbackProvider>
        <RootNavigator />
      </FeedbackProvider>
    </SettingsProvider>
  );
}
