import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // icônes pour la flèche

export default function Button({ label, onPress, type = "primary", style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[type === "primary" ? styles.primaryButton : null, style]}
    >
      {/* Si bouton back ou next → icône flèche vers la droite ou la gauche */}
      {type === "back" ? (
        <Ionicons name="arrow-back" size={30} color="#224c4aff" />
      ) : type === "next" ? (
        <Ionicons name="arrow-forward" size={30} color="#224c4aff" />
      ) : (
        <Text style={styles.primaryText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#507C79",
    marginVertical: 6,
    marginHorizontal: 4,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
