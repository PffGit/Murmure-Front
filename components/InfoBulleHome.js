import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const InfoBubble = ({ message, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Log à chaque rendu du composant
  // console.log(`[InfoBubble] Rendu du composant. Visible: ${visible}, Message: "${message}"`);

  useEffect(() => {
    // console.log(`[InfoBubble] useEffect déclenché. État visible: ${visible}`);

    if (visible) {
      // console.log('[InfoBubble] 🟢 Condition TRUE : Démarrage animation apparition');
      
      // Animation d'apparition
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => console.log('[InfoBubble] ✨ Animation apparition terminée'));

      // Auto-fermeture après 4 secondes
      console.log('[InfoBubble] ⏳ Démarrage du Timer (200s)');
      const timer = setTimeout(() => {
        // console.log('[InfoBubble] ⏰ Timer écoulé -> Appel de onClose()');
        onClose();
      }, 200000);                           // 200 secondes nombre qui peut etre modifie pour la duree de l'infobulle

      // Fonction de nettoyage
      return () => {
        // console.log('[InfoBubble]  Cleanup: Nettoyage du timer');
        clearTimeout(timer);
      };
    } else {
      // console.log("[InfoBubble] l'infobulle disparait"),
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => console.log('[InfoBubble] fin de la presence de l\'infobulle'));
    }
  }, [visible]);                      // Dépendances du useEffect

  // LOGIQUE CRITIQUE ICI
  if (!visible) {
    // console.log('[InfoBubble] ⛔ Erreur : Le composant ne s\'affiche pas . Rendu est "null".');
    return null;
  }

  return (
    <Animated.View style={[styles.infoBubbleContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.infoBubble}
        onPress={() => {
            //console.log('[InfoBubble]  Clic utilisateur sur X -> Fermeture de l\'infobulle');
            onClose();
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.infoBubbleText}>{message}</Text>

        {/* Bouton de fermeture */}
        <Text style={styles.infoBubbleClose}>✕</Text> 
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  infoBubbleContainer: {
    position: 'absolute',
    bottom: 640,
   
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },

  infoBubble: {
    backgroundColor: '#81be83ff',
    paddingVertical: 9,        // Réduit de 15 à 12
    paddingHorizontal: 25,      // Réduit de 25 à 18
    borderRadius: 20,           // Réduit de 25 à 20
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 380,              //largeur minimale de l'infobulle
    maxWidth: 400,              // Ajout d'une largeur max
    marginTop: 220,
  },

  infoBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,               // Réduit de 16 à 14
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,             // Ajout pour un meilleur espacement des lignes
  },

  infoBubbleClose: {
    color: '#FFFFFF',
    fontSize: 16,               // Réduit de 18 à 16
    fontWeight: 'bold',
    marginLeft: 15,             // Réduit de 19 à 15
    marginBottom: 150,
    opacity: 0.7,
  },
});

export default InfoBubble;