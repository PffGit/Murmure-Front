import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { io } from "socket.io-client";
import * as Haptics from "expo-haptics";
// import { router } from "expo-router";
import Button from "../../components/Button";
import { BACKEND_ADDRESS } from "../../config";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  orPale: "#EBC97D",
  orPaleClair: "#fff7e4ff",
  bleuMenthe: "#AAD2D0",
  bleuMentheClair: "#b2c5c4ff",
  pecheRosee: "#f29570ff",
  pecheRoseeClair: "#FBB89D",
  vertSauge: "#95BE96",
  vertSaugeClair: "#eaf8eaff",
};

export default function ChatScreen({ route, navigation }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(""); //message texte le l'utilisateur
  const [messages, setMessages] = useState([]); // historique des messages
  const [loading, setLoading] = useState(false);

  // Connexion au serveur Socket.IO
  useEffect(() => {
    const newSocket = io(BACKEND_ADDRESS, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Quand le serveur envoie la réponse de l'IA
    newSocket.on("ai-message", (msg) => {
      setLoading(false);

      // vibration légère à la réception
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setMessages((prev) => [...prev, { sender: "ai", text: msg }]);
    });

    return () => newSocket.disconnect();
  }, []);

  // Envoyer un message
  const handleSend = () => {
    if (!message.trim() || !socket) return;

    const text = message.trim();

    // Ajouter le message de l'utilisateur à la liste
    setMessages((prev) => [...prev, { sender: "me", text }]);

    setMessage("");
    setLoading(true);
    // Envoyer le message au backend
    socket.emit("user-message", text);
  };

  // renderMessage est utilisé pour affichage par la Flatlist, (item = sender + text)
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "me" ? styles.meBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.outerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60} // parfois nécessaire en modal
      >
        {/* Container */}
        {/* Fermer la modale */}
        <View style={styles.handleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={30} color="#5A4E4D" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Chat Murmure</Text>

          {/* Affichage de tous les messages */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            style={styles.messagesList}
          />
          {/* Loading */}
          {loading && (
            <ActivityIndicator size="large" color={COLORS.vertSaugeClair} />
          )}

          {/* Input + bouton envoyer */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Raconte-moi..."
              placeholderTextColor="#8c8c8c"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.pecheRoseeClair,
  },

  outerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CCC",
    alignSelf: "center",
    marginBottom: 10,
  },

  // conteneur blanc bords arrondis
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6E0D8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
    color: "#5A4E4D",
  },
  // conteneur messages
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  // style conditionnel me / ai
  meBubble: {
    backgroundColor: COLORS.orPaleClair,
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: COLORS.vertSaugeClair,
    alignSelf: "flex-start",
  },

  messageText: {
    fontSize: 16,
    color: "#4A4A4A",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  input: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    color: "#333",
  },

  sendButton: {
    backgroundColor: COLORS.pecheRosee,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },

  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
