import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Label from "../../components/Label";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Murmure</Text>
      <Text style={styles.subtitle}>Ecran Home (placeholder)</Text>

      {/* Lien vers l'étagère */}
      <Label
        onPress={() => navigation.navigate("Shelves")}
        children="Etagère"
             />

      {/* Ici ajouter le lien vers la map, et vers auth */}
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
