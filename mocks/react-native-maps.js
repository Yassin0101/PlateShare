jest.mock('react-native-maps', () => {
    const { View } = require('react-native');
    const MockMapView = (props) => <View {...props} />;
    return {
      __esModule: true,
      default: MockMapView,
      Marker: MockMapView,
    };
  });