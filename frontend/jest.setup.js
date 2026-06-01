// Mock necesario para renderizar el degradado en pruebas unitarias.
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native')

  return {
    LinearGradient: View,
  }
})

// Mock ligero de iconos para evitar dependencias nativas en Jest.
jest.mock('@expo/vector-icons', () => {
  const React = require('react')
  const { Text } = require('react-native')

  return {
    Ionicons: ({ name }) => React.createElement(Text, null, name),
    MaterialCommunityIcons: ({ name }) => React.createElement(Text, null, name),
  }
})

// Mock de safe area para renderizar pantallas fuera del dispositivo real.
jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  const { View } = require('react-native')

  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  }
})

// Mock de AsyncStorage para probar preferencias locales sin módulo nativo real.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)
