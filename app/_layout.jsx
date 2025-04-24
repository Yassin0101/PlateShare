import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, NetInfo } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import AppContent from '../components/AppContent';

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

const ErrorScreen = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity
      style={styles.retryButton}
      onPress={onRetry}
      activeOpacity={0.8}
    >
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const MemoizedAppContent = React.memo(() => (
  <ThemeProvider>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </ThemeProvider>
));

const getErrorMessage = (error) => {
  if (error.message.includes('network')) {
    return 'Internet connection required. Please check your network.';
  }
  return error.message || 'Failed to load app resources. Please try again.';
};

// Mock resource loading functions (replace with actual implementations)
const cacheData = async () => {
  // Add actual data caching logic here
};

const loadFonts = async () => {
  // Example: await Font.loadAsync(...);
};

const fetchInitialData = async () => {
  // Add actual API calls here
};

export default function RootLayout() {
  const [appState, setAppState] = useState({ status: 'loading', error: null });
  const [isConnected, setIsConnected] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (appState.status === 'ready' || appState.status === 'error') {
      await SplashScreen.hideAsync();
    }
  }, [appState.status]);

  const initializeApp = useCallback(async () => {
    try {
      if (!isConnected) {
        throw new Error('network-error');
      }

      // Load all resources simultaneously
      await Promise.all([
        cacheData(),
        loadFonts(),
        fetchInitialData(),
      ]);

      setAppState({ status: 'ready', error: null });
    } catch (err) {
      setAppState({ 
        status: 'error', 
        error: getErrorMessage(err)
      });
    }
  }, [isConnected]);

  const handleRetry = useCallback(() => {
    setAppState({ status: 'loading', error: null });
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    initializeApp();
    
    return () => netInfoUnsubscribe();
  }, [initializeApp]);

  if (appState.status === 'error') {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ErrorScreen error={appState.error} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {appState.status === 'loading' ? (
        <LoadingScreen />
      ) : (
        <MemoizedAppContent />
      )}
    </View>
  );
}