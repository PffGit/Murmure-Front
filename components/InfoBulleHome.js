import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const InfoBubble = ({ message, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Log à chaque rendu du composant
  console.log(`[InfoBubble] Rendu du composant. Visible: ${visible}, Message: "${message}"`);

  useEffect(() => {
    console.log(`[InfoBubble] useEffect déclenché. État visible: ${visible}`);

    if (visible) {
      console.log('[InfoBubble] 🟢 Condition TRUE : Démarrage animation apparition');
      
      // Animation d'apparition
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => console.log('[InfoBubble] ✨ Animation apparition terminée'));

      // Auto-fermeture après 4 secondes
      console.log('[InfoBubble] ⏳ Démarrage du Timer (20s)');
      const timer = setTimeout(() => {
        console.log('[InfoBubble] ⏰ Timer écoulé -> Appel de onClose()');
        onClose();
      }, 20000);

      // Fonction de nettoyage
      return () => {
        console.log('[InfoBubble]  Cleanup: Nettoyage du timer');
        clearTimeout(timer);
      };
    } else {
      console.log("[InfoBubble] l'infobulle disparait"),
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => console.log('[InfoBubble] fin de la presence de l\'infobulle'));
    }
  }, [visible]); // Dépendances du useEffect

  // LOGIQUE CRITIQUE ICI
  if (!visible) {
    console.log('[InfoBubble] ⛔ Erreur : Le composant ne s\'affiche pas');
    return null;
  }

  return (
    <Animated.View style={[styles.infoBubbleContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.infoBubble}
        onPress={() => {
            console.log('[InfoBubble]  Clic utilisateur sur X -> Fermeture de l\'infobulle');
            onClose();
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.infoBubbleText}>{message}</Text>
        <Text style={styles.infoBubbleClose}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  infoBubbleContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  infoBubble: {
    backgroundColor: '#81be83ff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 350,
    marginTop: 200,
  },
  infoBubbleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  infoBubbleClose: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    opacity: 0.7,
  },
});

export default InfoBubble;