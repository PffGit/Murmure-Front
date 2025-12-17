import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';

import React, { useEffect, useRef,useState  } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from "react-native";                   // Pour obtenir les dimensions de l'écran
import { useSafeAreaInsets } from 'react-native-safe-area-context';   // Important pour le bouton retour


const { width, height } = Dimensions.get('window');                   // Obtenir les dimensions de l'écran pour l'exemple

// --- 1. HOOK DE POSITIONNEMENT AMÉLIORÉ --- // Permet de positionner des éléments de façon responsive sur une image

const useResponsiveImagePosition = (imageSource) => {
    const { width: screenW, height: screenH } = useWindowDimensions();                      // Dimensions de l'écran
    const [imageDimensions, setImageDimensions] = useState({ width: 1080, height: 1920 });  // Dimensions par défaut format portrait

    useEffect(() => { // Effectue le calcul des dimensions réelles de l'image
      // Sur web, on charge l'image pour obtenir ses vraies dimensions
      if (!Image.resolveAssetSource && typeof imageSource === 'number') {
        // Sur React Native Web, require() retourne un objet avec une propriété uri ou default
        const imgUri = imageSource?.default || imageSource;
        if (typeof window !== 'undefined' && imgUri) {
          const img = new window.Image();
          img.onload = () => {
            setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
            console.log(`[Web] Dimensions réelles de l'image: ${img.naturalWidth}x${img.naturalHeight}`);
          };
          img.src = imgUri; 
        }
      }
  }, [imageSource]);

  // Vérification de sécurité pour éviter les crashes
  let imageData = null;

  if (Image.resolveAssetSource) {
    // Sur mobile (iOS/Android)
    imageData = Image.resolveAssetSource(imageSource);
  } else {
    // Sur web, on utilise les dimensions chargées dynamiquement
    imageData = imageDimensions;
  }

  if (!imageData) {
    console.warn('Image source invalide');
    return {
      getPos: () => ({ position: 'absolute' }),
      scale: 1,
      originalW: 0,
      originalH: 0,
    };
  }

  const { width: originalW, height: originalH } = imageData; // Dimensions originales de l'image

  const screenRatio = screenW / screenH; // Ratio écran
  const imageRatio = originalW / originalH; // Ratio image

  let scale, xOffset, yOffset; // Variables pour le calcul

  if (screenRatio > imageRatio) {
    // L'image est plus "haute" que l'écran
    scale = screenW / originalW; // On base l'échelle sur la largeur
    xOffset = 0;
    yOffset = (screenH - originalH * scale) / 2; // Centrage vertical
  } else {
    scale = screenH / originalH; // On base l'échelle sur la hauteur
    yOffset = 0;
    xOffset = (screenW - originalW * scale) / 2; // Centrage horizontal
  }

  const getPos = (originalX, originalY) => ({
    // position après mise à l'échelle et centrage
    left: xOffset + originalX * scale,
    top: yOffset + originalY * scale,
    position: 'absolute',
  });

  return {
    getPos, // Fonction de positionnement
    scale, // Facteur d'échelle pour adapter les tailles
    originalW, // Largeur originale de l'image
    originalH, // Hauteur originale de l'image
  };
};

// --- 2. LE COMPOSANT BOUTON PULSANT ---

// Ce composant gère sa propre animation pour être réutilisable.
const PulsingButton = ({ onPress, color, style, buttonScale = 1 }) => {
  // Valeur animée qui ira de 0 à 1 en boucle
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Définition de la boucle d'animation
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1, 
          duration: 2000,                         // Durée d'un battement (2s)
          useNativeDriver: true,                  // Important pour la fluidité sur mobile
        })
      ).start();
    }, [animation]);

    // Interpolation : Transformer la valeur 0->1 en Échelle (taille)
    const scaleAnim = animation.interpolate({
      inputRange: [0, 1], 
      outputRange: [1, 2.5],                      // Le cercle grandit de 1x à 2.5x sa taille
    });

    // Interpolation : Transformer la valeur 0->1 en Opacité
    const opacityAnim = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],                        // L'opacité passe de 1 à invisible (0)
    });

    // Couleur dynamique basée sur la prop 'color'
    const rippleColor = color || "#FF5722";

    return (
    // RETURN DES PULSING BUTTON
        <View style={[styles.buttonWrapper, style, {
          width: 100 * buttonScale, 
          height: 90 * buttonScale, // Ajuste la taille du conteneur pour le positionnement
        }]}>
          {/* L'anneau animé en arrière-plan */}
          <Animated.View
            style={[
              styles.pulseRing,                  // Style de base de l'anneau
              {
                backgroundColor: rippleColor,
                width: 60 * buttonScale,
                height: 60 * buttonScale,
                borderRadius: 60 * buttonScale,
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
            style={[styles.buttonCenter, {
              backgroundColor: "transparent",
              width: 30 * buttonScale,
              height: 30 * buttonScale,
              borderRadius: 15 * buttonScale,
            }]}
          />
        </View>
  );
};

export default function ShelvesScreen({ navigation }) {
    const backgroundImage = require('../../assets/etagereCoco.png');
    const { getPos, scale, originalW, originalH } = useResponsiveImagePosition(backgroundImage); // Utilisation du hook amélioré
    const insets = useSafeAreaInsets(); // Pour gérer l'encoche du téléphone


    // --- DÉFINITION DES POSITIONS EN POURCENTAGES ---
    // Utilisation de pourcentages des dimensions originales pour un meilleur responsive
    const posMeditation = getPos(originalW * 0.49, originalH * 0.27);       //   50% de la largeur, 30% de la hauteur
    const posRespiration = getPos(originalW * 0.363, originalH * 0.432);    //   35% de la largeur, 45% de la hauteur
    const posChat = getPos(originalW * 0.59, originalH * 0.41);             //   60% de la largeur, 40% de la hauteur
    const posFlashcard = getPos(originalW * 0.65, originalH * 0.59);        //   65% de la largeur, 60% de la hauteur

  return (
    <ImageBackground style={styles.background} source={backgroundImage} resizeMode="cover">
      {/* --- ZONE 1 : LES BOUTONS DU DÉCOR (Position Absolue sur l'image) --- */}

      {/* Méditation */}
      <PulsingButton
        color="#f1c972ff"
        style={posMeditation}
        buttonScale={scale}
        onPress={() => navigation.navigate('MeditationHome')}
      />

      {/* Respiration */}
      <PulsingButton
        color="#93c29eff"
        style={posRespiration}
        buttonScale={scale}
        onPress={() => navigation.navigate('RespirationHome')}
      />

      {/* Chat */}
      <PulsingButton
        color="#f8f6f3ff"
        style={posChat}
        buttonScale={scale}
        onPress={() => navigation.navigate('Chat')}
      />

        {/* Flashcard */}
      <PulsingButton
        color="#776b73ff" 
        style={posFlashcard}
        buttonScale={scale}
        onPress={() => navigation.navigate('Flashcard')}
      />


      {/* --- ZONE 2 : UI FLOTTANTE (Bouton Retour) --- */}
      {/* pointerEvents="box-none" est CRUCIAL : cela permet de cliquer "à travers" 
            les zones vides de ce conteneur pour atteindre les boutons en dessous */}

      <View style={[styles.uiContainer, { paddingTop: Math.max(insets.top, 20) }]} pointerEvents="box-none">
        {/* Bouton Précédent */}
        <View style={styles.navigationContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#224c4aff" />
            <Text style={styles.backButtonText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Styles pour l'écran
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Conteneur pour l'interface utilisateur (bouton retour)
  uiContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Styles du composant PulsingButton (les tailles sont maintenant gérées dynamiquement)
  buttonWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Assure que le bouton est au-dessus de l'image
    // Astuce debug : décommenter pour visualiser les zones cliquables
    // backgroundColor: 'rgba(255,0,0,0.3)',
  },
  pulseRing: {
    position: 'absolute', // L'anneau est derrière le centre
  },
  buttonCenter: {
    // Tailles dynamiques appliquées via props
  },
  // Bouton Back
  navigationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 20, // Augmenté pour être au-dessus des PulsingButton (qui ont zIndex: 10)
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#f1f7f4d2',
  },

  backButtonText: {
    color: '#224c4aff',
    fontSize: 16,
    fontWeight: '600',
  },
});
