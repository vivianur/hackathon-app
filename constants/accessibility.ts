export type Complexity = 'low' | 'medium' | 'high';

export const AccessibilityDefaults = {
  complexity: 'medium' as Complexity,
  focusMode: false,
  contrast: 'normal' as 'normal' | 'high',
  textSize: 'normal' as 'small' | 'normal' | 'large',
  motion: 'reduced' as 'reduced' | 'normal',
};
