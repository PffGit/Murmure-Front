import { View, Text, StyleSheet } from "react-native";

import Button from "../../components/Button";

export default function ChatScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans le Chat</Text>
      <Text style={styles.subtitle}>Ecran ChatScreen</Text>

      {/* Bouton précédent: goBack */}
      <Button onPress={() => navigation.goBack()} type="back" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
