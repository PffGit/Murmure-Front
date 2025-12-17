import { BACKEND_ADDRESS } from '../../config';

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../components/Button';
import ParrotChatBtn from '../../components/ParrotChatBtn'; // Bouton perroquet pour chat
import { useFocusEffect } from '@react-navigation/native'; // Pour gérer le focus de l'écran

// import pour les infobulles
import InfoBubble from '../../components/InfoBulleHome'; // composant infobulle personnalisé

// --- 1. HOOK DE POSITIONNEMENT AMÉLIORÉ --- // Permet de positionner des éléments de façon responsive sur une image

const useResponsiveImagePosition = (imageSource) => {
  const { width: screenW, height: screenH } = useWindowDimensions(); // Dimensions de l'écran
  const [imageDimensions, setImageDimensions] = useState({ width: 1080, height: 1920 }); // Dimensions par défaut format portrait

  useEffect(() => {
    //le useEffect sert à charger les dimensions de l'image sur le web
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

  const { width: originalW, height: originalH } = imageData; // variable dimensions originale de l'image

  const screenRatio = screenW / screenH; // variable screenRatio pour Ratio écran
  const imageRatio = originalW / originalH; // variable imageRatio pour Ratio image

  let scale, xOffset, yOffset; // variables de calcul

  if (screenRatio > imageRatio) {
    // L'image est plus "haute" que l'écran
    scale = screenW / originalW;
    xOffset = 0;
    yOffset = (screenH - originalH * scale) / 2; // Centrage vertical
  } else {
    scale = screenH / originalH;
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
        duration: 2000, // Durée d'un battement (2s)
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
    outputRange: [1, 0], // L'opacité passe de 1 à invisible (0)
  });

  // Couleur dynamique basée sur la prop 'color'
  const rippleColor = color || '#FF5722';

  // RETURN DES PULSING BUTTON
  return (
    <View
      style={[
        styles.buttonWrapper,
        style,
        {
          width: 50 * buttonScale,
          height: 50 * buttonScale,
        },
      ]}
    >
      {/* L'anneau animé en arrière-plan */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: rippleColor,
            width: 40 * buttonScale,
            height: 40 * buttonScale,
            borderRadius: 20 * buttonScale,
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
        style={[
          styles.buttonCenter,
          {
            backgroundColor: 'transparent',
            width: 30 * buttonScale,
            height: 30 * buttonScale,
            borderRadius: 15 * buttonScale,
          },
        ]}
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const backgroundImage = require('../../assets/homescreen.png');
  const { getPos, scale, originalW, originalH } = useResponsiveImagePosition(backgroundImage); // Utilisation du hook amélioré
  // getPos pour positionner, scale pour adapter les tailles

  // --- DÉFINITION DES POSITIONS EN POURCENTAGES ---

  const posEtagere = getPos(originalW * -0.22, originalH * 0.55); // PULSING BUTTON ÉTAGÈRE
  const posCarte = getPos(originalW * 0.33, originalH * 0.55); // PULSING BUTTON CARTE

  const posPerroquet = getPos(originalW * 0.32, originalH * 0.195); // POSITION PERROQUET CHAT

  const { isConnected, username } = useSelector((state) => state.userConnection); // Récupérer le statut de connexion depuis Redux

  const [infoBubble, setInfoBubble] = useState({ visible: false, message: '' }); // integration de l'infobulle

  // 1. Log à chaque rendu (très important pour voir les mises à jour d'état)
  console.log(
    `[HomeScreen -- Infobulle] 🎨 Rendu. État bulle: visible=${infoBubble.visible}, msg="${infoBubble.message}"`
  );

  useEffect(() => {
    // console.log('[HomeScreen -- Infobulle] 🚀 useEffect (Mount) -> Lancement de checkVisitCount');
    checkVisitCount();
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/chapters/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.chapters && data.chapters.length > 0) {
          console.log('✅ Data received from backend');
          dispatch(setAllChapters(data.chapters));
        } else {
          console.log('⚠️ Backend empty, loading chaptersSafe');
        }
      })
      .catch((err) => {
        console.log('❌ Fetch error, loading chaptersSafe', err);
      });
  }, []);

  // NOUVEAU CODE - Basé sur le statut de connexion de l'utilisateur

  useEffect(() => {
    checkVisitCount(); // Appel initial pour vérifier le statut de visite
  }, [isConnected]); // Dépendance sur isConnected pour réagir aux changements de statut

  // NOUVEAU CODE - Basé sur le statut de connexion de l'utilisateur CONNECTED VS NON CONNECTED
  const checkVisitCount = () => {
    // Utiliser le statut de connexion depuis Redux au lieu d'AsyncStorage

    if (!isConnected) {
      // Si l'utilisateur n'est PAS connecté -> message de bienvenue
      // console.log('[HomeScreen -- Infobulle]  Utilisateur NON connecté -> Message de bienvenue');
      setInfoBubble({
        visible: true,
        message:
          "✨ Bienvenue sur Murmure! ✨\n\nSouhaitez vous me parler ou commencer votre parcours?\nJe vous invite à cliquer sur l'étagère ou la porte vers le jardin.\n\n À très vite ! 😊",
      });
    } else {
      // Si l'utilisateur EST connecté -> message "ravi de vous revoir"
      // console.log('[HomeScreen -- Infobulle] ✅ Utilisateur connecté -> Message "Ravi de vous revoir"');
      setInfoBubble({
        visible: true,
        message: `✨ Ravi de vous revoir ${username}! ✨\n\nPrêt à continuer?\n\nSouhaitez-vous continuer vers votre parcours ou initier une séance de relaxation?\n\nOu peut-être préférez-vous me parler?`,
      });
    }
  };

  const closeInfoBubble = () => {
    // console.log('[HomeScreen -- Infobulle] 🔇 Appel de closeInfoBubble -> Reset du state');
    setInfoBubble({ visible: false, message: '' });
  };

  return (
    <ImageBackground style={styles.background} source={require('../../assets/homescreenCadre.png')} resizeMode="cover">
      <View style={styles.container}>
        {/* Bulle d'information */}
        <InfoBubble message={infoBubble.message} visible={infoBubble.visible} onClose={closeInfoBubble} />

        <View style={styles.labelContainer}>
          {/* Bouton Mon Compte en haut à gauche */}
          <Button
            label={isConnected ? 'Mon compte' : 'Se Connecter'} // Texte dynamique basé sur le redux
            type="primary"
            style={styles.compteButton}
            onPress={() => {
              // console.log("ok le btn mon compte fonctionne!");
              navigation.navigate('Compte');
            }}
          />

          {/* Affichage du statut de connexion */}
          {/* {isConnected && (
                      <Text style={styles.compteStatus}>
                        connected
                      </Text>
                    )} */}

          <View style={styles.header}>
            <View style={styles.messageBubble}>
              {/* Perroquet : ouvre screen Chat */}
              <ParrotChatBtn
                onPress={() => {
                  navigation.navigate('Chat');
                }}
                style={[
                  posPerroquet,
                  {
                    width: 100 * scale,
                    height: 100 * scale,
                    transform: [{ scaleX: -1 }], // Miroir horizontal
                  },
                ]}
              />
            </View>
          </View>

          {/* --- BOUTON 1 (Étagère - Bas à gauche) --- */}
          <PulsingButton
            color="#ebaa20ff" // Jaune doux
            style={posEtagere}
            buttonScale={scale}
            onPress={() => {
              // console.log("ok le lien vers l'etagere fonctionne!");
              navigation.navigate('Shelves');
            }}
            children="Etagère"
          />

          {/* --- BOUTON 2 (Carte - Bas à droite) --- */}
          <PulsingButton
            color="#2aa148ff" // Vert doux
            style={posCarte}
            buttonScale={scale}
            onPress={() => {
              // console.log("ok le lien vers la map fonctionne!");
              navigation.navigate('Map');
            }}
            children="Carte"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  labelContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    marginTop: 30,
  },

  messageBubble: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: '100%',
    position: 'relative',
  },

  header: {
    paddingTop: 100,
    paddingBottom: 10,
  },

  compteButton: {
    position: 'absolute',
    top: 1,
    right: 50,
    marginBottom: 50,
    marginTop: 30,
    zIndex: 100,
    width: 158, // Largeur fixe pour éviter le décalage lors du changement de texte
  },

  compteStatus: {
    position: 'absolute',
    top: 5,
    left: 0,
    marginTop: 40,
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#5B9BD5',
    textAlign: 'left',
    zIndex: 100,
  },

  // Styles du composant PulsingButton (les tailles sont maintenant gérées dynamiquement)
  buttonWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  pulseRing: {
    position: 'absolute',
  },

  buttonCenter: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ombre pour Android
  },

  infoBubble: {
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
});
