import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  Alert,
  Pressable,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';

import Label from '../../components/Label';
import Button from '../../components/Button';


// Obtenir les dimensions de l'écran pour l'exemple
const { width, height } = Dimensions.get('window');

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
  const rippleColor = color || '#FF5722';

  return ( // RETURN DES PULSING BUTTON
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
        style={[styles.buttonCenter, { backgroundColor: 'transparent' }]}
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { isConnected, username } = useSelector((state) => state.userConnection);

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../assets/homescreen.png')}
      resizeMode="cover"
    >
      {/* <Image source={require('../../assets/perroquet.png')}
             style={styles.perroquet}
      /> */}

      <View style={styles.container}>
        <View style={styles.labelContainer}>
          {/* Lien vers l'étagère */}
          {/* <Label onPress={() => navigation.navigate("Shelves")} 
                children="Etagère" 
                style={styles.etagere}
                /> */}

          {/* Lien vers la map */}
          {/* <Label onPress={() => navigation.navigate("Map")} 
                children="Carte" 
                style={styles.carte}
                /> */}

          {/* <Image
             source={{ uri: 'https://placehold.co/600x900/2E4053/FFFFFF/png?text=Illustration+Feu+de+Camp' }}
             style={styles.backgroundImage}
             resizeMode="cover"
           /> */}

          <Button
            label="Mon compte"
            type="primary"
            style={styles.compteButton}
            onPress={() => {
              console.log('ok le btn mon compte fonctionne!');
              navigation.navigate('Compte');
            }}
          />

          <Text style={styles.compteStatus}>
            {isConnected ? 'Connecté' : 'Non connecté'}
          </Text>

          <View style={styles.header}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Bonjour!{'\n'}
                Comment allez-vous aujourd'hui ?{'\n'}
                Souhaitez vous me parler ou commencer votre parcours?{' '}
                <Text style={{ fontStyle: 'italic' }}>
                  (cliquez sur la porte vers le jardin){'\n'}
                </Text>
                Ou faire une activité en particuler ?{' '}
                <Text style={{ fontStyle: 'italic' }}>
                  (selectionnez l'étagère)
                </Text>
              </Text>

              {/* Perroquet : ouvre modale Chat */}
              <Pressable onPress={() => navigation.navigate('ChatScreen')}>
                <Image
                  source={require('../../assets/chat/perroquet.png')}
                  style={styles.perroquet}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.messageia}>
            <Text
              style={styles.dialogueperroquet}
              // placeholder="Ecris moi si tu veux me parler !"
              placeholderTextColor="#224C4A"
              onPress={() => {
                console.log('ok le lien vers chatscreen fonctionne!');
                navigation.navigate('ChatScreen');
              }}
            >
              Ecris moi si tu veux me parler !
            </Text>
          </View>

          {/* --- BOUTON 1 (Bas à gauche) --- */}
          <PulsingButton
            color="#ebaa20ff" // Or pale
            style={styles.pulsingEtagere}
            onPress={() => navigation.navigate('Shelves')}
            children="Etagère"
          />

          {/* --- BOUTON 2 (Bas à droite) --- */}
          <PulsingButton
            color="#2aa148ff" // Vert doux
            style={styles.pulsingCarte}
            onPress={() => navigation.navigate('Map')}
            children="Carte"
          />
        </View>

        {/* Ici ajouter lien vers mon compte */}
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

  perroquet: {
    position: 'absolute',
    top: 10,
    right: 2,
    width: 100,
    height: 100,
    transform: [{ scaleX: -1 }],
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
    backgroundColor: '#D8F0E4',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: '100%',
    position: 'relative',
  },

  messageText: {
    fontSize: 15.5,
    lineHeight: 21,
    fontWeight: '500',
    color: '#224C4A',
  },

  messageia: {
    position: 'relative',
    backgroundColor: '#D8F0E4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 130,
    // padding: 40,
    // width: '100%',
    // alignSelf: 'flex-start',
  },

  dialogueperroquet: {
    position: 'absolute',
    top: 6,
    color: '#224C4A',
    fontSize: 15.5,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 21,
    marginLeft: 20,
  },

  header: {
    paddingTop: 100,
    paddingBottom: 10,
  },

  compteButton: {
    position: 'absolute',
    top: 5,
    left: 1,
    marginTop: 30,
    zIndex: 100,
  },

  compteStatus: {
    position: 'absolute',
    top: 5,
    left: 160,
    marginTop: 44,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#5B9BD5',
    textAlign: 'left',
    zIndex: 100,
  },

  // title: {
  //   fontSize: 24,
  //   fontWeight: "600",
  //   marginBottom: 10,
  // },
  // subtitle: {
  //   fontSize: 16,
  //   color: "#666",
  // },

  // etagere: {
  //   marginRight: 80,
  //   marginBottom: 50,
  // },

  // carte: {
  //   marginRight: 40,
  //   marginBottom: 50,
  // },






  // backgroundImage: {
  //   width: '100%',
  //   height: '100%',
  //   position: 'absolute',
  // },

  // Styles du composant PulsingButton
  buttonWrapper: {
    position: 'absolute', // Permet de placer le bouton sur l'image
    width: 50, // Taille globale de la zone du bouton
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex assure que le bouton est au-dessus de l'image
    zIndex: 10,
  },

  pulseRing: {
    position: 'absolute', // L'anneau est derrière le centre
    width: 40, // Taille de base de l'anneau
    height: 40,
    borderRadius: 20, // Pour faire un cercle parfait (moitié de la taille)
  },

  buttonCenter: {
    width: 30, // Le centre est un peu plus petit que l'anneau de départ
    height: 30,
    borderRadius: 15,
    // Petite ombre pour le relief (optionnel)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ombre pour Android
  },

  pulsingEtagere: {
    bottom: 300, // Position depuis le bas
    left: 25, // Position depuis la gauche
  },

  pulsingCarte: {
    bottom: 300, // Position depuis le bas
    right: 50, // Position depuis la droite
  },
});
