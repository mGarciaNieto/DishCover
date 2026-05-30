module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  watchman: false,
  testPathIgnorePatterns: ['/node_modules/', '/app-example/', '/.expo/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|expo|expo-.*|@expo/.*|@expo-google-fonts/.*|expo-router|@react-navigation/.*|nativewind|react-native-css)/)',
  ],
}
