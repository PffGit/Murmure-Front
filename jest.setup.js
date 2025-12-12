// Configuration globale pour Jest

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock pour les images
jest.mock('react-native/Libraries/Image/AssetRegistry', () => ({
  getAssetByID: jest.fn(() => ({
    uri: 'mocked-image-uri',
    width: 100,
    height: 100,
  })),
}));
