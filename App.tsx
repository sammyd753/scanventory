import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { store } from './src/store';
import Navigation from './src/navigation';
import { useAppDispatch } from './src/hooks/useRedux';
import { getCurrentUser } from './src/store/slices/authSlice';
import { fetchRooms } from './src/store/slices/roomSlice';
import { fetchBins } from './src/store/slices/binSlice';
import { fetchItems } from './src/store/slices/itemSlice';
import { fetchTags } from './src/store/slices/tagSlice';
import { colors } from './src/styles';

// App content component
const AppContent = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(getCurrentUser()),
          dispatch(fetchRooms()),
          dispatch(fetchBins()),
          dispatch(fetchItems()),
          dispatch(fetchTags())
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load app data. Please restart the app.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading app data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
};

// Styles for loading and error states
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

// Main App component with Redux Provider
export default function App() {
  const [reduxError, setReduxError] = useState<string | null>(null);

  // Wrap the Provider in an error boundary
  if (reduxError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {reduxError}
        </Text>
      </View>
    );
  }

  try {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  } catch (error) {
    setReduxError('Failed to initialize the app. Please restart.');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          An unexpected error occurred. Please restart the app.
        </Text>
      </View>
    );
  }
}
