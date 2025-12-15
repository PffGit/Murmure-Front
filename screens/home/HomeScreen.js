import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";

import Button from "../../components/Button";
import ParrotChatBtn from "../../components/ParrotChatBtn";

        
// import pour les infobulles
import AsyncStorage from '@react-native-async-storage/async-storage'; // pour le stockage local
import InfoBubble from "../../components/InfoBulleHome"; // composant infobulle personnalisé


// Obtenir les dimensions de l'écran pour l'exemple
const { width, height } = Dimensions.get('window'); // dimensions de l'écran utilisé pour positionner les boutons



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

  // Récupérer le statut de connexion depuis Redux
  const { isConnected, username } = useSelector((state) => state.userConnection);

  // integration de l'infobulle
    const [infoBubble, setInfoBubble] = useState({ visible: false, message: '' });

    // 1. Log à chaque rendu (très important pour voir les mises à jour d'état)
    console.log(`[HomeScreen -- Infobulle] 🎨 Rendu. État bulle: visible=${infoBubble.visible}, msg="${infoBubble.message}"`);


    useEffect(() => {
      // console.log('[HomeScreen -- Infobulle] 🚀 useEffect (Mount) -> Lancement de checkVisitCount');
      checkVisitCount();
    }, []);

    
    // NOUVEAU CODE - Basé sur le statut de connexion de l'utilisateur
    const checkVisitCount = () => {
      // Vérifier si l'utilisateur est connecté
      AsyncStorage.getItem('userToken') // Récupère le token de l'utilisateur depuis AsyncStorage
      // rappel: asyncStorage est utilisé pour stocker des données localement sur le device; similaire au localStorage du navigateur web
        
        .then((userToken) => {
          const isLoggedIn = userToken !== null; // Si le token existe, l'utilisateur est connecté

          if (!isLoggedIn) { // Si l'utilisateur n'est PAS connecté -> toujours message de bienvenue
              console.log('[HomeScreen -- Infobulle]  Utilisateur NON connecté -> Message de bienvenue');
            setInfoBubble({
              visible: true,
              message: "✨ Bienvenue sur Murmure! ✨\n\nSouhaitez vous me parler ou commencer votre parcours?\nJe vous invite à cliquer sur l'étagère ou la porte vers le jardin.\n\n À très vite ! 😊"
            });
          } else {// Si l'utilisateur EST connecté -> message "ravi de vous revoir"
              console.log('[HomeScreen -- Infobulle] ✅ Utilisateur connecté -> Message "Ravi de vous revoir"');
            setInfoBubble({
              visible: true,
              message: "✨ Ravi de vous revoir! ✨\n\nPrêt à continuer?\n\nSouhaitez-vous continuer vers votre parcours ou initier une séance de relaxation?\n\nOu peut-être préférez-vous me parler?"
            });
          }
        })
        .catch((error) => { // Gestion des erreurs
          console.error('[HomeScreen -- Infobulle] ❌ Erreur lors de la vérification:', error);
        });
    };

    const closeInfoBubble = () => { 
        // console.log('[HomeScreen -- Infobulle] 🔇 Appel de closeInfoBubble -> Reset du state');
      setInfoBubble({ visible: false, message: '' });
    };

  
    return (
      <ImageBackground style={styles.background}
          source={require('../../assets/homescreen.png')}
          resizeMode="cover"
          >
    
        <View style={styles.container}>
              {/* Bulle d'information */}
                <InfoBubble 
                  message={infoBubble.message}
                  visible={infoBubble.visible}
                  onClose={closeInfoBubble}
                />


                <View style={styles.labelContainer}>

                  {/* Bouton Mon Compte en haut à gauche */}
                    <Button
                        label="Mon compte"
                        type="primary"
                        style={styles.compteButton}
                        onPress={() => {
                          console.log("ok le btn mon compte fonctionne!");
                          navigation.navigate("Compte");
                        }}
                    />

                  {/* Affichage du statut de connexion */}
                    {isConnected && (
                      <Text style={styles.compteStatus}>
                        connected
                        
                      </Text>
                    )}

                      <View style={styles.header}>
                          <View style={styles.messageBubble}>
                              {/* <Text style={styles.messageText}>
                                    Bonjour!{"\n"}
                                    Comment allez-vous aujourd'hui ?{"\n"}
                                    Souhaitez vous me parler ou commencer votre parcours? <Text style={{ fontStyle: 'italic' }}>(cliquez sur la porte vers le jardin){"\n"}</Text>
                                    Ou faire une activité en particuler ? <Text style={{ fontStyle: 'italic' }}>(selectionnez l'étagère)</Text>
                              </Text> */}
                      
                              {/* Perroquet : ouvre screen Chat */}
                                <Pressable onPress={() => {navigation.navigate("Chat")}}>
                                    <Image
                                      source={require("../../assets/chat/perroquet.png")}
                                      style={styles.perroquet}
                                    />
                                </Pressable>
                          </View>
                      </View>

                    {/* <View style={styles.messageia}>
                      <Text
                        style={styles.dialogueperroquet}
                        placeholderTextColor="#224C4A"
                        onPress={() => {
                          console.log("ok le lien vers chatscreen fonctionne!");
                          navigation.navigate("Chat");
                        }}>
                        {/* Ecris moi si tu veux me parler ! *
                      </Text>
                    </View>   */}
                      

                  {/* --- BOUTON 1 (Bas à gauche) --- */}
                    <PulsingButton
                      color="#ebaa20ff" // Or pale
                      style={styles.pulsingEtagere}
                      onPress={() => {
                        console.log("ok le lien vers l'etagere fonctionne!");
                        navigation.navigate("Shelves")}}
                          children="Etagère"
                    />

                  {/* --- BOUTON 2 (Bas à droite) --- */}
                    <PulsingButton
                      color="#2aa148ff" // Vert doux
                      style={styles.pulsingCarte}
                      onPress={() => {
                        console.log("ok le lien vers la map fonctionne!");
                        navigation.navigate("Map")}}
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
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  perroquet: {
    position: "absolute",
    top: 163,
    left: 90,
    width: 100,
    height: 100,
    transform: [{ scaleX: -1 }],
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  labelContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    marginTop: 30,
  },

  messageBubble: {
    // backgroundColor: "#D8F0E4",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "100%",
    position: "relative",
    // left:20,
    // marginBottom: 100,
  },

  //  messageText: {
  //   fontSize: 15.5,
  //   lineHeight: 21,
  //   fontWeight: "500",
  //   color: "#224C4A",
  // },

  // messageia: {
  //   position: "relative",
  //   backgroundColor: "#D8F0E4",
  //   paddingVertical: 20,
  //   paddingHorizontal: 20,
  //   borderRadius: 12,
  //   marginTop: 0,
  //   right: 140,
    // padding: 40,
    // width: '100%',
    // alignSelf: 'center ',
  // },

  // dialogueperroquet: {
  //   position: "absolute",
  //   top: 6,
  //   color: "#224C4A",
  //   fontSize: 15.5,
  //   fontWeight: "500",
  //   textAlign: "center",
  //   lineHeight: 21,
  //   marginLeft: 20,
  // },

  header: {
    paddingTop: 100,
    paddingBottom: 10,
  },

  compteButton: {
    position: "absolute",
    top: 1,
    right: 60,
    marginBottom: 50,
    marginTop: 30,
    zIndex: 100,
  },

  compteStatus: {
    position: "absolute",
    top: 5,
    left: 2,
    marginTop: 44,
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#5B9BD5",
    textAlign: "left",
    zIndex: 100,
  },

  // Styles du composant PulsingButton
  buttonWrapper: {
    position: "absolute", // Permet de placer le bouton sur l'image
    width: 50, // Taille globale de la zone du bouton
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    // zIndex assure que le bouton est au-dessus de l'image
    zIndex: 10,
  },

  pulseRing: {
    position: "absolute", // L'anneau est derrière le centre
    width: 40, // Taille de base de l'anneau
    height: 40,
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

  pulsingEtagere: {
    bottom: 370,    
    right: 140,     
  },

  pulsingCarte: {
    bottom: 370, 
    left: 130,   
  },


  infoBubble: {
    // backgroundColor: "#D8F0E4",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },

});
