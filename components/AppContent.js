// components/AppContent.js
import { SafeAreaView, StatusBar } from 'react-native';
import { Slot } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemesStyles';

export default function AppContent() {
  const { darkMode } = useTheme();
  const themeStyles = useThemeStyles();

  return (
    <SafeAreaView style={themeStyles.safeArea}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Slot />
    </SafeAreaView>
  );
}