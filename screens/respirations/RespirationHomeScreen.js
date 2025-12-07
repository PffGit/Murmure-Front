import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/Button";

export default function RespirationHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Respiration</Text>
      <Text style={styles.subtitle}>Ecran RespirationHomeScreen</Text>

      {/* Bouton suivant vers RespirationCountdown */}
      <Button
        onPress={() => navigation.navigate("RespirationCountdown")}
        label="Démarrer countdown"
        type="primary"
      />

      {/* Bouton Précédent */}
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
