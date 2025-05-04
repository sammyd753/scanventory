import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../styles';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
    backgroundColor: colors.error + '20', // 20% opacity
    borderRadius: 8,
    marginBottom: spacing.m,
  },
  message: {
    color: colors.error,
    fontSize: typography.fontSizeRegular,
    marginBottom: onRetry => (onRetry ? spacing.m : 0),
  },
  retryButton: {
    marginTop: spacing.s,
  },
});

export default ErrorMessage;
