import { View, Text, StyleSheet } from "react-native";

import Button from "../../components/Button";

export default function MeditationHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Meditation</Text>
      <Text style={styles.subtitle}>Ecran MeditationHomeScreen</Text>

      {/* Bouton suivant vers player */}

     <Button
        onPress={() => navigation.navigate("MeditationPlayer")}
        label="Démarrer méditation"
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
    color: "#000000ff",
  },
});
