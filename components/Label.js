import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Label({ children, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.label, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#FA897D",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "transparent",
  },
});