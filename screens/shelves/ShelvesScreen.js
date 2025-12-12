import { View, Text, StyleSheet, ImageBackground, Animated, Dimensions, TouchableOpacity, Image } from "react-native";

import React, { useEffect, useRef } from "react";
import Button from "../../components/Button";
import Label from "../../components/Label";

// Obtenir les dimensions de l'écran pour l'exemple
const { width, height } = Dimensions.get("window");

// --- 1. LE COMPOSANT BOUTON PULSANT ---
// Ce composant gère sa propre animation pour être réutilisable.
const PulsingButton = ({ onPress, color, style }) => {
  // Valeur animée qui ira de 0 à 1 en boucle
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Définition de la boucle d'animation
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000, // Durée d'un battement (1.5s)
        useNativeDriver: true, // Important pour la fluidité sur mobile
      })
    ).start();
  }, [animation]);

  // Interpolation : Transformer la valeur 0->1 en Échelle (taille)
  const scaleAnim = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5], // Le cercle grandit de 1x à 2.5x sa taille
  });

  // Interpolation : Transformer la valeur 0->1 en Opacité
  const opacityAnim = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0], // L'opacité passe de 0.8 à invisible (0)
  });

  // Couleur dynamique basée sur la prop 'color'
  // const ringColor = color || '#FF5722';
  // const centerColor = color || '#FF5722';
  const rippleColor = color || "#FF5722";

  return (
    // RETURN DES PULSING BUTTON
    <View style={[styles.buttonWrapper, style]}>
      {/* L'anneau animé en arrière-plan */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: rippleColor,
            // On applique les transformations calculées au-dessus
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Le bouton central cliquable */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.buttonCenter, { backgroundColor: "transparent" }]}
      />
    </View>
  );
};

export default function ShelvesScreen({ navigation }) {
  return (
    <ImageBackground style={styles.background} source={require("../../assets/etagereCoco.png")} resizeMode="cover">
      <View style={styles.container}>
        {/* Bouton Précédent */}
        <Button onPress={() => navigation.navigate("Home")} type="back" />

        {/* --- BOUTON  Meditatoin --- */}
        <PulsingButton
          color="#f1c972ff" // Or pale
          style={styles.pulsingMeditation}
          onPress={() => {
            console.log("ok lien vers MeditationHome fonctionnel");
            navigation.navigate("Home");
          }}
          // children="Etagère"
        />

        {/* --- BOUTON Respiration --- */}
        <PulsingButton
          color="#93c29eff" // Vert doux
          style={styles.pulsingRespiration}
          onPress={() => {
            console.log("ok lien vers RespirationHome fonctionnel");
            navigation.navigate("RespirationHome");
          }}
          // children="Carte"
        />

        {/* --- BOUTON Flashcard --- */}
        <PulsingButton
          color="#4b5458ff" // Vert doux
          style={styles.pulsingFlashcard}
          onPress={() => {
            console.log("ok lien vers Flashcard fonctionnel");
            navigation.navigate("flashcard");
          }}
          // children="Carte"
        />

        {/* --- BOUTON ChatScreen--- */}
        <PulsingButton
          color="#f8f6f3ff" // Vert doux
          style={styles.pulsingChatScreen}
          onPress={() => {
            console.log("ok lien vers ChatScreen fonctionnel");
            navigation.navigate("ChatScreen");
          }}
          // children="Carte"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // styles pour l'ecran
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // Styles du composant PulsingButton
  buttonWrapper: {
    position: "absolute",
    width: 100, // Taille globale de la zone du bouton = plus large zone cliquable
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // zIndex assure que le bouton est au-dessus de l'image
  },
  pulseRing: {
    position: "absolute", // L'anneau est derrière le centre
    width: 20, // Taille de base de l'anneau
    height: 20,
    borderRadius: 20, // Pour faire un cercle parfait (moitié de la taille)
  },
  buttonCenter: {
    width: 30, // Le centre est un peu plus petit que l'anneau de départ
    height: 30,
    borderRadius: 15,
    // Petite ombre pour le relief (optionnel)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ombre pour Android
  },

  // Positionnement spécifique des boutons sur l'écran
  pulsingMeditation: {
    bottom: 650,
    left: 0,
  },

  pulsingRespiration: {
    bottom: 510,
    right: 20,
  },

  pulsingFlashcard: {
    bottom: 350,
    left: 80,
  },

  pulsingChatScreen: {
    bottom: 505,
    left: 50,
  },
});
