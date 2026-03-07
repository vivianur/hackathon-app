export type ComplexityLevel = 'simple' | 'moderate' | 'detailed';
export type ContrastLevel = 'low' | 'medium';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Spacing = 'compact' | 'comfortable' | 'spacious';

export type SettingsPreferences = {
  notifications: boolean;
  soundEffects: boolean;
  encouragementMessages: boolean;
  transitionWarnings: boolean;
};

export type Settings = {
  complexityLevel: ComplexityLevel;
  focusMode: boolean;
  detailedMode: boolean;
  contrastLevel: ContrastLevel;
  fontSize: FontSize;
  spacing: Spacing;
  animationsEnabled: boolean;
  cognitiveAlerts: boolean;
  vlibrasEnabled: boolean;
  darkMode: boolean;
  preferences: SettingsPreferences;
};

export const DEFAULT_SETTINGS: Settings = {
  complexityLevel: 'moderate',
  focusMode: false,
  detailedMode: false,
  contrastLevel: 'medium',
  fontSize: 'medium',
  spacing: 'comfortable',
  animationsEnabled: true,
  cognitiveAlerts: true,
  vlibrasEnabled: true,
  darkMode: false,
  preferences: {
    notifications: true,
    soundEffects: true,
    encouragementMessages: true,
    transitionWarnings: true,
  },
};
