import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

// import navigation
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';

import AppNavigator from "./navigation/AppNavigator";

// used for screen size (insets) to be correctly measured
import { SafeAreaProvider } from "react-native-safe-area-context";

// import Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./reducers/store";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // console.log("--- [App.js] 0. Composant monté. Démarrage du processus de préparation.");
    async function prepare() {
      try {
        // console.log("--- [App.js] 1. Démarrage du prechargement des images dans assets ---");
        // 2. Charger les images ici
        await Asset.loadAsync([
          require('./assets/paysage-bienvenue.png'),
          require('./assets/etagereCoco.png'),
          require('./assets/perroquet.png'),
          require('./assets/map.png'),
          require('./assets/meditation/meditation.png'),
          require('./assets/meditation/meditationBkg.png'),
          require('./assets/homescreenCadre.png'),
        ]);
        // console.log("--- [App.js] 2. Image chargées en memoire ---");

      } catch (e) {
        console.warn(e);
      } finally {
        // 3. Dire à l'app qu'on est prêt
        // console.log("--- [App.js] 3. Application marquée comme PRÊTE (setAppIsReady -> true).");
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 4. Cette fonction s'exécute dès que la View principale est affichée
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // console.log("--- [App.js] 5. App prête, on cache le Splash Screen natif --- Apparition de l'ecran choisi ---");
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // On n'affiche rien tant que ce n'est pas chargé (le splash natif reste visible)
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
