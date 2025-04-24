import React from 'react';
import { View } from 'react-native';

// Web-compatible mock component
const MapView = ({ children, style }) => (
  <View style={style}>{children}</View>
);

export const Marker = ({ children }) => <>{children}</>;
export const PROVIDER_GOOGLE = 'google';

export default MapView;