import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock des modules de navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));
jest.mock('../navigation/AppNavigator', () => 'AppNavigator');

// Récupérer les mocks depuis jest.setup.js
const mockAsset = require('expo-asset');

describe('App - SplashScreen Tests', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();

    // Mock console pour éviter les logs pendant les tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.warn.mockRestore();
  });

  test('devrait appeler Asset.loadAsync au démarrage', async () => {
    render(<App />);

    // Attendre que Asset.loadAsync soit appelé
    await waitFor(() => {
      expect(mockAsset.Asset.loadAsync).toHaveBeenCalled();
    });
  });

  test('devrait charger 7 images', async () => {
    render(<App />);

    await waitFor(() => {
      expect(mockAsset.Asset.loadAsync).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.any(String),
        ])
      );
    });
  });

  test('devrait gérer les erreurs de chargement', async () => {
    // Simuler une erreur
    const errorMessage = 'Erreur de chargement des assets';
    mockAsset.Asset.loadAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<App />);

    // Vérifier que l'erreur a été loggée dans console.warn
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalled();
    });

    // Vérifier que l'app marque quand même l'app comme prête malgré l'erreur
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[App.js] 3. Application marquée comme PRÊTE')
      );
    });
  });

  test('devrait logger le démarrage de l\'application', async () => {
    render(<App />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[App.js] 0. Composant monté')
      );
    });
  });

  test('devrait logger le début du préchargement', async () => {
    render(<App />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[App.js] 1. Démarrage du prechargement')
      );
    });
  });

  test('devrait marquer l\'app comme prête après chargement', async () => {
    render(<App />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[App.js] 3. Application marquée comme PRÊTE')
      );
    });
  });
});
