import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return <Text style={[styles.base, textTypeStyles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: '#111827',
  },
});

const textTypeStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0a7ea4',
  },
});
