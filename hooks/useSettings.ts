import React, { createContext, useContext } from 'react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { usePersistentState } from '@/hooks/usePersistentState';
import { DEFAULT_SETTINGS, type Settings } from '@/types';

type SettingsContextValue = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  ready: boolean;
  setComplexityLevel: (value: Settings['complexityLevel']) => void;
  setFontSize: (value: Settings['fontSize']) => void;
  setSpacing: (value: Settings['spacing']) => void;
  setContrastLevel: (value: Settings['contrastLevel']) => void;
  toggleFocusMode: () => void;
  toggleDetailedMode: () => void;
  toggleAnimations: () => void;
  toggleCognitiveAlerts: () => void;
  toggleVlibras: () => void;
  toggleDarkMode: () => void;
  updatePreferences: (patch: Partial<Settings['preferences']>) => void;
  resetToDefaults: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function useProvideSettings(): SettingsContextValue {
  const { state: settings, setState: setSettings, ready } = usePersistentState<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
    {
      hydrate: (stored, initial) => ({
        ...initial,
        ...stored,
        preferences: {
          ...initial.preferences,
          ...stored.preferences,
        },
      }),
    },
  );

  const setComplexityLevel = (value: Settings['complexityLevel']) => {
    setSettings((prev) => ({ ...prev, complexityLevel: value }));
  };

  const setFontSize = (value: Settings['fontSize']) => {
    setSettings((prev) => ({ ...prev, fontSize: value }));
  };

  const setSpacing = (value: Settings['spacing']) => {
    setSettings((prev) => ({ ...prev, spacing: value }));
  };

  const setContrastLevel = (value: Settings['contrastLevel']) => {
    setSettings((prev) => ({ ...prev, contrastLevel: value }));
  };

  const toggleFocusMode = () => {
    setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }));
  };

  const toggleDetailedMode = () => {
    setSettings((prev) => ({ ...prev, detailedMode: !prev.detailedMode }));
  };

  const toggleAnimations = () => {
    setSettings((prev) => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  };

  const toggleCognitiveAlerts = () => {
    setSettings((prev) => ({ ...prev, cognitiveAlerts: !prev.cognitiveAlerts }));
  };

  const toggleVlibras = () => {
    setSettings((prev) => ({ ...prev, vlibrasEnabled: !prev.vlibrasEnabled }));
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const updatePreferences = (patch: Partial<Settings['preferences']>) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...patch,
      },
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    setSettings,
    ready,
    setComplexityLevel,
    setFontSize,
    setSpacing,
    setContrastLevel,
    toggleFocusMode,
    toggleDetailedMode,
    toggleAnimations,
    toggleCognitiveAlerts,
    toggleVlibras,
    toggleDarkMode,
    updatePreferences,
    resetToDefaults,
  } as const;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const value = useProvideSettings();

  return React.createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
}
