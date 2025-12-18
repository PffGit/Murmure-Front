import { BACKEND_ADDRESS } from '../../config';

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../components/Button';
import ParrotChatBtn from '../../components/ParrotChatBtn'; // Bouton perroquet pour chat
import { useFocusEffect } from '@react-navigation/native'; // Pour gérer le focus de l'écran

// import pour les infobulles
import InfoBubble from '../../components/InfoBulleHome'; // composant infobulle personnalisé
import { setAllChapters } from '../../reducers/chapters';
import useResponsiveImagePosition from '../../hooks/useResponsiveImagePosition'; // Hook de positionnement responsive

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
          width: 70 * buttonScale, // Taille augmentée : 50 → 70
          height: 70 * buttonScale,
        },
      ]}
    >
      {/* L'anneau animé en arrière-plan */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: rippleColor,
            width: 70 * buttonScale, // Taille augmentée : 50 → 70
            height: 70 * buttonScale,
            borderRadius: 35 * buttonScale, // Ajusté pour rester circulaire (70/2)
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
            width: 80 * buttonScale,  // Taille augmentée : 40 → 55
            height: 80 * buttonScale,
            borderRadius: 80 * buttonScale, // Ajusté pour rester circulaire (55/2)
          },
        ]}
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const backgroundImage = require('../../assets/homescreenCadre.png');
  const { getPos, scale, originalW, originalH } = useResponsiveImagePosition(backgroundImage); // Utilisation du hook amélioré
  // getPos pour positionner, scale pour adapter les tailles

  // --- DÉFINITION DES POSITIONS EN POURCENTAGES ---

  const posEtagere = getPos(originalW * -0.20, originalH * 0.50);                   // PULSING BUTTON ÉTAGÈRE
  const posCarte = getPos(originalW * 0.36, originalH * 0.50);                      // PULSING BUTTON CARTE
  const posPerroquet = getPos(originalW * 0.42, originalH * 0.162);                 // POSITION PERROQUET CHAT
  const posButton = getPos(originalW * -0.29, originalH * -0.007);                      // POSITION BOUTON MON COMPTE              
             // POSITION INFO BULLE

  const { isConnected, username } = useSelector((state) => state.userConnection); // Récupérer le statut de connexion depuis Redux

  const [infoBubble, setInfoBubble] = useState({ visible: false, message: '' }); // integration de l'infobulle

  // DEBUG: Afficher les valeurs des insets  ===>  a regarder dans la console pour connaitre les valeurs exactes et ajuster le positionnement
  console.log(`[SafeArea] top: ${insets.top}, bottom: ${insets.bottom}, left: ${insets.left}, right: ${insets.right}`);

  // Modèle iPhone	       \\ insets.top	  \\ Calcul	          \\Position finale
  // Votre iPhone (X-14)	 \\ 47px	        \\max(47-16, 10)	    \\31px ✅
  // iPhone 14 Pro+	       \\ 59px	        \\max(59-16, 10)	    \\43px ✅             NE PAS SUPPRIMER SVP
  // iPhone SE/8	         \\ 20px	        \\max(20-16, 10)	    \\10px ✅

  /// FORMULE : Math.max(insets.top - 16, 10)
  /// EX: style={[styles.compteButton, { top: Math.max(insets.top - 16, 10), right: 50 }]}

  // 1. Log à chaque rendu (très important pour voir les mises à jour d'état)
  console.log(
    `[HomeScreen -- Infobulle] 🎨 Rendu. État bulle: visible=${infoBubble.visible}, msg="${infoBubble.message}"`
  );

  useEffect(() => {
    // console.log('[HomeScreen -- Infobulle] 🚀 useEffect (Mount) -> Lancement de checkVisitCount');
    checkVisitCount();
  }, []);

  // --- CODE POUR CHARGER LES CHAPITRES DEPUIS LE BACKEND AU MONTAGE DE L'ÉCRAN

  const dispatch = useDispatch();

  useEffect(() => {
    // Chargement des chapitres depuis le backend
    fetch(`${BACKEND_ADDRESS}/chapters/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.chapters && data.chapters.length > 0) {
          console.log('✅ Data received from backend');
          dispatch(setAllChapters(data.chapters)); // Met à jour le store Redux avec les chapitres reçus
        } else {
          console.log('⚠️ Backend empty, loading chaptersSafe');
        }
      })
      .catch((err) => {
        // Gérer les erreurs de fetch
        console.log('❌ Fetch error, loading chaptersSafe', err);
      });
  }, []);

  // --- NOUVEAU CODE - Basé sur le statut de connexion de l'utilisateur CONNECTED VS NON CONNECTED

  useEffect(() => {
    checkVisitCount(); // Appel initial pour vérifier le statut de visite
  }, [isConnected]); // Dépendance sur isConnected pour réagir aux changements de statut

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
      <View style={[styles.container, { top: Math.max(insets.top - 16, 10)}]}>

        {/* Bulle d'information */}
        <InfoBubble message={infoBubble.message} visible={infoBubble.visible} onClose={closeInfoBubble}  />
        
        <View style={styles.labelContainer}>

          {/* Bouton Mon Compte en haut à gauche */}
          <Button
            label={isConnected ? 'Mon compte' : 'Se Connecter'}  // Texte dynamique basé sur le redux
            type="primary"
            style={[styles.compteButton, posButton]}             // Position adaptative : 31px sur notch, min 10px sur anciens iPhone
            onPress={() => {
              // console.log("ok le btn mon compte fonctionne!");
              navigation.navigate('Compte');
            }}
          />

          <View style={styles.header}>
            <View style={styles.messageBubble}>

              {/* Perroquet : ouvre screen Chat */}
              <ParrotChatBtn
                onPress={() => {navigation.navigate('Chat');}}
                style={[posPerroquet,
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
    // alignItems: 'center',
    // justifyContent: 'center',
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
    top: 10,
    left: 20,
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
