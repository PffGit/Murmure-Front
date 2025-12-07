import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Button from "../../components/Button";

export default function MeditationPlayer({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Bienvenue dans Meditation</Text>

      <Text style={styles.subtitle}>Ecran MeditationPlayer</Text>

      {/* Bouton Suivant */}
          <Button onPress={() => navigation.navigate("Shelves")}
            label="Retour Etagère"
             type="primary"/>
      
     
      {/* Bouton Précédent */}
             <Button onPress={() => navigation.goBack()}
         
             type="back"/>
      
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
