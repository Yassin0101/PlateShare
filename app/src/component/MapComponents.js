import { Platform } from 'react-native';

// Conditional imports for native vs web
const MapView = Platform.select({
  native: () => require('react-native-maps').default,
  default: () => require('./MapView.web').default
})();

const Marker = Platform.select({
  native: () => require('react-native-maps').Marker,
  default: () => require('./MapView.web').Marker
})();

// Your main map component
const MapComponent = ({ region, markers }) => {
  return (
    <MapView 
      style={{ flex: 1 }}
      region={region}
      provider={Platform.OS === 'android' ? 'google' : undefined}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
};

export default MapComponent;