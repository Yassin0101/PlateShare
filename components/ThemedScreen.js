// components/ThemedScreen.js
import { View } from 'react-native';
import { useThemeStyles } from '../hooks/useThemesStyles';

export default function ThemedScreen({ children }) {
  const themeStyles = useThemeStyles();
  
  return (
    <View style={themeStyles.container}>
      {children}
    </View>
  );
}