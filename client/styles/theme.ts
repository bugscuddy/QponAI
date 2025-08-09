// Lightweight shared theme for QponAI auth screens
export const colors = {
  primary: '#1E80FF',
  primaryDark: '#0F66D6',
  bg: '#F7F9FC',
  cardBg: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#6B7280',
  border: '#E5E7EB',
  subtle: '#F3F4F6',
  success: '#16A34A',
  warning: '#F59E0B',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

import type { TextStyle } from 'react-native';

export const typography = {
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.2 } as TextStyle,
  subtitle: { fontSize: 15, fontWeight: '500' } as TextStyle,
  body: { fontSize: 16 } as TextStyle,
  caption: { fontSize: 12 } as TextStyle,
};
