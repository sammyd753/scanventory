import { StyleSheet } from 'react-native';

// Define color palette
export const colors = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  background: '#F8F8F8',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  lightGray: '#E0E0E0',
  mediumGray: '#9E9E9E',
  darkGray: '#616161',
  error: '#FF3B30',
  success: '#4CD964',
  warning: '#FF9500',
};

// Define typography
export const typography = {
  fontSizeSmall: 12,
  fontSizeRegular: 14,
  fontSizeMedium: 16,
  fontSizeLarge: 18,
  fontSizeXLarge: 24,
  fontSizeXXLarge: 32,
  fontWeightLight: '300' as const,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightBold: '700' as const,
};

// Define spacing
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Define common styles
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    marginBottom: spacing.s,
  },
  text: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizeSmall,
    marginBottom: spacing.m,
  },
});
