// hooks/useThemeStyles.js
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const useThemeStyles = () => {
  const { darkMode } = useTheme();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#FFFFFF',
      padding: 16,
    },
    text: {
      color: darkMode ? '#FFFFFF' : '#000000',
    },
    // Add more styles as needed
  });
};