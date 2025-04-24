// components/ThemeWrapper.js
import { useTheme } from '../context/ThemeContext';
import { View, StatusBar } from 'react-native';

export default function ThemeWrapper({ children }) {
  const { darkMode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#121212' : '#FFFFFF' }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      {children}
    </View>
  );
}