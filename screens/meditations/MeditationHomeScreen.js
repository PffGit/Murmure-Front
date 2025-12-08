import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
} from "react-native";
import DurationSelector from "../../components/DurationSelector";
import Button from "../../components/Button";
import { useState } from "react";

export default function MeditationHomeScreen({ navigation }) {
  // Récupération des states: type de méditation, mode (guidée ou solo), duration
  const [type, setType] = useState("anxiete");
  const [mode, setMode] = useState("guidee");
  const [duration, setDuration] = useState(5);
  console.log("type:", type, "mode:", mode, "duration:", duration);

  const meditationTypes = [
    { label: "Anxiété", value: "anxiete" },
    { label: "Sommeil", value: "sommeil" },
    { label: "Détente", value: "detente" },
  ];

  // Fonction qui ouvre le screenMeditationPlayer en lui passant des params : type,mode,duration, qui seront des req.params
  const startMeditation = () => {
    navigation.navigate("MeditationPlayer", {
      type,
      mode,
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
              Bonjour, tu peux choisir le thème de la méditation qui te convient
              le mieux aujourd'hui, ainsi que sa durée, tu pourras ensuite
              lancer la méditation !
            </Text>

            {/* Perroquet : ouvre modale Chat */}
            <Pressable onPress={() => navigation.navigate("ChatScreen")}>
              <Image
                source={require("../../assets/chat/perroquet.png")}
                style={styles.perroquet}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          {/* Choix du type de méditation */}
          <Text style={styles.label}>Type de méditation</Text>
          <View style={styles.dropdown}>
            {meditationTypes.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setType(item.value)}
                style={[
                  styles.dropdownItem,
                  type === item.value && styles.dropdownSelected,
                ]}
              >
                <Text>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Choix guidée ou solo avec bouton segmenté */}
          <View style={styles.segment}>
            <Pressable
              style={[
                styles.segmentBtn,
                mode === "guidee" && styles.segmentActive,
              ]}
              onPress={() => setMode("guidee")}
            >
              <Text style={styles.segmentText}>Guidée</Text>
            </Pressable>

            <Pressable
              style={[
                styles.segmentBtn,
                mode === "solo" && styles.segmentActive,
              ]}
              onPress={() => setMode("solo")}
            >
              <Text style={styles.segmentText}>Solo</Text>
            </Pressable>
          </View>

          {/* Choix de la durée avec composant de type Slider */}
          <DurationSelector
            mode={mode} 
            value={duration} // valeur actuelle
            onChange={(value) => setDuration(value)} //permet de savoir
          />
        </View>

        {/* Bouton démarrage */}
        <View style={styles.footer}>
          <Button
            onPress={startMeditation}
            label="Démarrer méditation"
            type="primary"
            style={styles.startButton}
          />

          {/* Bouton Précédent */}
          <Button
            onPress={() => navigation.goBack()}
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

  // header
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
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
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

  dropdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },

  dropdownSelected: {
    borderColor: "#507C79",
    backgroundColor: "#E3F2F1",
  },

  segment: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },

  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  segmentActive: {
    backgroundColor: "#D9ECEB",
  },

  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#224C4A",
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
    width: "60%",
    marginBottom: 30,
  },

  backButton: {
    marginTop: 12,
    marginLeft: 5,
  },
});
