import { Pressable, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

export default function ParrotChatBtn({ onPress, style, size = 100 }) {
  // 1. Initialisation de la valeur d'animation
  const moveAnim = useRef(new Animated.Value(0)).current;

  // 2. Définition de la boucle d'animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000), // Attend 1 seconde
        // Mouvement vers la droite
        Animated.timing(moveAnim, {
          toValue: 6, // Déplace de 10 pixels vers la droite
          duration: 1000, // En 1 seconde
          easing: Easing.inOut(Easing.ease), // Mouvement fluide
          useNativeDriver: true,
        }),
        Animated.delay(3000), // Attend 1 seconde
        // Retour à la position initiale
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [moveAnim]);

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Image
        source={require('../assets/chat/coco.png')}
        style={{ width: size, height: size }}
        // resizeMode="contain"
      />
      {/* Image de l'œil (Animée) */}
      <Animated.Image
        source={require('../assets/chat/coco-eye.png')} // Assurez-vous que le chemin est correct
        style={{
          position: 'absolute',
          // AJUSTEZ CES VALEURS (TOP/LEFT) SELON VOTRE DESSIN
          top: size * 0.18, // Exemple: à 30% du haut
          left: size * 0.38, // Exemple: à 40% de la gauche
          width: size * 0.15, // Exemple: l'œil fait 20% de la taille du corps
          height: size * 0.15,
          transform: [{ translateX: moveAnim }], // Applique l'animation
        }}
        //resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    // Le conteneur doit avoir une taille pour que le positionnement absolu de l'enfant fonctionne bien
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
