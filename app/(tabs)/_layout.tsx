import { HapticTab } from '@/components/haptic-tab';
import { useAdaptiveTheme } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';

export default function TabLayout() {
  const { ui } = useAdaptiveTheme();
  const { width } = useWindowDimensions();
  const isTiny = width < 330;
  const isSmall = width < 380;
  const webNavbarPink = '#be0079';
  const navbarBackground = ui.mode.monochrome ? ui.colors.accent : webNavbarPink;

  const iconSize = isTiny ? 0 : isSmall ? 16 : 20;
  const fontSize = isSmall ? 11 : 12;
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
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.82)',
        tabBarActiveBackgroundColor: 'rgba(255,255,255,0.14)',
        headerShown: false,
        sceneStyle: {
          paddingTop: 0,
        },
        tabBarButton: HapticTab,
        tabBarPosition: 'top',
        tabBarStyle: {
          width: '100%',
          maxWidth: ui.layout.maxContentWidth,
          alignSelf: 'center',
          height: tabHeight,
          paddingVertical: isSmall ? 4 : 8,
          paddingHorizontal: isTiny ? 4 : 8,
          backgroundColor: navbarBackground,
          borderBottomWidth: 0,
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
          marginHorizontal: isTiny ? 0 : 2,
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
        name="tasks"
        options={{
          title: 'Tarefas',
          tabBarIcon: mkIcon('checkmark-done-circle'),
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
