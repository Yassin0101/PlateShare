import React from 'react';
import { View, Text } from 'react-native';

// Web mock components
const MapView = ({ children, style }) => (
  <View style={style}>
    <Text>Map View (Web Preview)</Text>
    {children}
  </View>
);

const Marker = ({ children }) => <>{children}</>;

export const PROVIDER_GOOGLE = 'google';
export { Marker };
export default MapView;