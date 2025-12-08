import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";

// Slider: composant curseur, utilisé pour choisir les durées: méditation (solo ou guidée) et respiration

export default function DurationSelector({
  mode = "guidee", // "solo" | "guidee" | "respiration"
  value, //valeur sélectionnée
  onChange, //fonction du parent 
}) {
  // valeurs spécifiques  méditations guidées
  const GUIDED_VALUES = [3, 5, 10];

  // logique selon mode guidé (pour alléger le)
  const isGuided = mode === "guidee";

  const getSliderProps = () => {
    if (isGuided) {
      // ici sur le slider on ne manipule les index du tableau
      return {
        minimumValue: 0,
        maximumValue: GUIDED_VALUES.length - 1,
        step: 1,
        sliderValue: GUIDED_VALUES.indexOf(value), //ici la value affichée correpond à la valeur du tableau à cet index donné
      };
    }

    if (mode === "solo") {
      return {
        minimumValue: 1,
        maximumValue: 20,//maxi 20 minutes
        step: 1,
        sliderValue: value, //correspond à la value du curseur 
      };
    }

    if (mode === "respiration") {
      return {
        minimumValue: 1,
        maximumValue: 15,
        step: 1,
        sliderValue: value,
      };
    }
  };

  const { minimumValue, maximumValue, step, sliderValue } = getSliderProps();

// ceci est une version destructurée qui équivaut à dire: 
// const sliderProps = getSliderProps();
// const minimumValue = sliderProps.minimumValue;

// Ici on récupère la value transmise par le parent (durée)
  const handleChange = (sliderPosition) => {
    let newValue = sliderPosition;

    if (isGuided) {
      newValue = GUIDED_VALUES[sliderPosition];
    }

    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Durée : {value} min</Text>

      <Slider
        style={{ width: "100%" }}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={sliderValue}
        minimumTrackTintColor="#f28c8c"
        maximumTrackTintColor="#ddd"
        onValueChange={handleChange}
      />

      {/* repères visuels pour valeurs guidées */}
      {isGuided && (
        <View style={styles.marksContainer}>
          {GUIDED_VALUES.map((v) => (
            <Text key={v} style={styles.mark}>
              {v}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  marksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  mark: {
    fontSize: 14,
    opacity: 0.7,
  },
});
