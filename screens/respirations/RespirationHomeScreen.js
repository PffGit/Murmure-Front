import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Button from "../../components/Button";
import DurationSelector from "../../components/DurationSelector";
import { useState } from "react";
import ParrotChatBtn from "../../components/ParrotChatBtn";

export default function RespirationHomeScreen({ navigation }) {
  const [duration, setDuration] = useState(5);

  const startBreathing = () => {
    navigation.navigate("RespirationCountdown", {
      duration,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Bulle message */}
        <View style={styles.header}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Choisis la durée de ta séance de respiration. Tu pourras ensuite
              suivre un rythme doux d'inspiration et d'expiration guidé.
            </Text>
            {/* Perroquet : ouvre modale Chat */}

            {/* <Pressable onPress={() => navigation.navigate("ChatScreen")}>
              <Image
                source={require("../../assets/chat/perroquet.png")}
                style={styles.perroquet}
              />
            </Pressable> */}

            <ParrotChatBtn
              onPress={() => navigation.navigate("Chat")}
              style={styles.perroquet}
            />
          </View>
        </View>

        {/* Body: choix de la durée */}
        <View style={styles.body}>
          <Text style={styles.label}>Durée de la séance de respiration</Text>
          {/* Choix de la durée avec composant de type Slider */}
          <DurationSelector
            mode="respiration"
            value={duration}
            onChange={(value) => setDuration(value)}
          />
        </View>

        {/* Bouton démarrage */}
        <View style={styles.footer}>
          <Button
            onPress={startBreathing}
            label="Démarrer respiration"
            type="primary"
            style={styles.startButton}
          />

          {/* Bouton Précédent */}
          <Button
            onPress={() => navigation.navigate("Shelves")}
            type="back"
            style={styles.backButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  // header perroquet
  header: {
    paddingTop: 40,
    paddingBottom: 10,
  },

  messageBubble: {
    backgroundColor: "#D8F0E4",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "100%",
    position: "relative",
  },

  messageText: {
    fontSize: 15.5,
    lineHeight: 21,
    fontWeight: "500",
    color: "#224C4A",
  },

  perroquet: {
    position: "absolute",
    right: -10,
    bottom: -100,
    // width: 100,
    // height: 100,
    transform: [{ scaleX: -1 }], //perroquet retourné miroir
  },

  // body
  body: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 25,
    paddingBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#224C4A",
    marginBottom: 10,
  },

  // footer
  footer: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "flex-end",
  },

  startButton: {
    alignSelf: "center",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    marginTop: 12,
    marginLeft: 5,
  },
});
