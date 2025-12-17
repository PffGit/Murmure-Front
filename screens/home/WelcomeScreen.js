import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Juste un timer pour la transition visuelle
    // console.log("--- [WelcomeScreen] 4. Affichage du screen paysage pendant 1,2s ...");

    const timer = setTimeout(() => {
      // console.log("--- [WelcomeScreen] 6. Navigation vers l'ecran principal HOME.");
      navigation.replace("Home"); // .replace évite de pouvoir revenir en arrière sur l'écran de bienvenue
    }, 1200); // 1,2 secondes pour le splashscreen

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../assets/paysage-bienvenue.png')}
      resizeMode="cover"
    >
      <View style={[styles.texte, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Bienvenue dans Murmure</Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  texte: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', 
    alignItems: 'center', 
  },
   title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#d99174",
    textAlign: "center",
  },
});


