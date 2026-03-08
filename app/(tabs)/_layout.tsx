import { HapticTab } from '@/components/haptic-tab';
import { useAdaptiveTheme } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export default function TabLayout() {
  const { ui } = useAdaptiveTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTiny = width < 330;
  const isSmall = width < 389;
  const isWeb = Platform.OS === 'web';
  const isDark = ui.mode.dark;
  const isMonochrome = ui.mode.monochrome;
  const webNavbarPink = '#be0079';
  const navbarBackground = isDark
    ? '#1e1e1e'
    : isMonochrome
      ? ui.colors.accent
      : webNavbarPink;

  const activeTintColor = isDark
    ? (isMonochrome ? '#cccccc' : ui.colors.accent)
    : '#ffffff';

  const inactiveTintColor = isDark
    ? (isMonochrome ? 'rgba(204,204,204,0.78)' : 'rgba(255,0,208,0.72)')
    : 'rgba(255,255,255,0.96)';

  const activeBackgroundColor = isDark
    ? (isMonochrome ? 'rgba(204,204,204,0.14)' : 'rgba(255,0,208,0.18)')
    : 'rgba(255,255,255,0.2)';

  const iconSize = isTiny ? 0 : isSmall ? 16 : 20;
  const fontSize = isSmall ? 10 : 11;
  const tabHeight = isSmall ? 64 : 72;

  const mkIcon = (name: React.ComponentProps<typeof Ionicons>['name']) => {
    const Icon = ({ color }: { color: string }) =>
      isTiny ? null : <Ionicons name={name} size={iconSize} color={color} />;

    Icon.displayName = `TabIcon_${name}`;

    return Icon;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarActiveBackgroundColor: activeBackgroundColor,
        headerShown: false,
        sceneStyle: {
          paddingTop: 0,
        },
        tabBarButton: HapticTab,
        tabBarPosition: isWeb ? 'top' : 'bottom',
        tabBarStyle: {
          width: '100%',
          maxWidth: ui.layout.maxContentWidth,
          alignSelf: 'center',
          height: tabHeight,
          paddingVertical: isSmall ? 4 : 8,
          paddingHorizontal: isTiny ? 1 : 2,
          backgroundColor: navbarBackground,
          borderBottomWidth: 0,
          borderTopWidth: 0,
          ...(ui.layout.isTabletFrame && {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.35)',
            overflow: 'hidden',
          }),
        },
        tabBarLabelStyle: {
          fontSize,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          flexDirection: 'row',
          gap: isTiny ? 0 : 4,
          alignItems: 'center',
          borderRadius: 10,
          marginHorizontal: isTiny ? 0 : 0.5,
          overflow: 'hidden',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: mkIcon('home'),
        }}
      />
      <Tabs.Screen
        name="plataforma"
        options={{
          title: 'Plataforma',
          tabBarIcon: mkIcon('globe-outline'),
          tabBarItemStyle: {
            flex: isSmall ? 1.28 : 1.16,
            marginTop: isWeb && isMobile ? 9 : 0,
          },
          tabBarLabelStyle: {
            fontSize: isSmall ? 9 : fontSize,
            fontWeight: '600',
          },
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
          tabBarIcon: mkIcon('checkmark-done-circle'),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Painel',
          tabBarIcon: mkIcon('speedometer'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: mkIcon('person-circle'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config.',
          tabBarIcon: mkIcon('settings'),
        }}
      />
    </Tabs>
  );
}
