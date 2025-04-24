module.exports = {
    resolve: {
      alias: {
        'react-native-maps$': 'react-native-web-maps',
        'react-native/Libraries/Utilities/codegenNativeCommands': 
          require.resolve('./mocks/codegenNativeCommands.js')
      }
    }
  };