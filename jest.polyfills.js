// Polyfills pour Jest - DOIT s'exécuter AVANT tout le reste

// Mock pour Expo Winter registry AVANT que les modules soient chargés
if (typeof global.__ExpoImportMetaRegistry === 'undefined') {
  global.__ExpoImportMetaRegistry = new Proxy(
    {},
    {
      get(target, prop) {
        // Retourner une fonction vide ou undefined selon la propriété
        if (typeof prop === 'string') {
          return () => {};
        }
        return undefined;
      },
      set() {
        // Ignorer les set
        return true;
      },
    }
  );
}
