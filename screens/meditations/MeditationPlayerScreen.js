import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import Button from "../../components/Button";

// Doc audio: https://docs.expo.dev/versions/latest/sdk/av/


import { BACKEND_ADDRESS } from "../../config";

export default function MeditationPlayer({ route, navigation }) {
  // Params passés par l'écran MeditationHomeScreen
  const { type, mode, duration } = route.params;

  // states définis
  const [audioUrl, setAudioUrl] = useState("");
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // console.log("audioURL:", audioUrl);
  // console.log("sound", sound);
  // console.log("isPlaying", isPlaying);
  // console.log("loading", loading);
  // console.log("back", BACKEND_ADDRESS);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/meditation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, mode, duration }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        // console.log("data", data);

        if (!data.audioUrl) return;

        // Si tout est ok, on met à jour le state avec l'url renvoyé par le backend
        setAudioUrl(data.audioUrl);

        // await Audio.setAudioModeAsync({
        //   playsInSilentModeIOS: true,
        //   allowsRecordingIOS: false,
        //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //   shouldDuckAndroid: true,
        // });

        // charger le son
        const { sound: newSound } = await Audio.Sound.createAsync(//createAsync()télécharge le fichier url et renvoie l'objet sound
          { uri: data.audioUrl },
          { shouldPlay: true },//lance automatiquement la lecture
          (status) => {
            console.log("status audio :", status);
          }
        );

        setSound(newSound);
        setIsPlaying(true);
        setLoading(false);
      });
  }, []);

  // Nettoyage du son
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
        console.log("Son déchargé");
      }
    };
  }, [sound]);

  //PlayPause btn
  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();//met en pause
      setIsPlaying(false);
    } else {
      await sound.playAsync(); //démarrage de la lecture
      setIsPlaying(true);
    }
  };

  // Au stop, on retourne sur précédent
  const stopMeditation = async () => {
    // sécurité nettoyage du son quand on quitte la page
    if (sound) {
      await sound.stopAsync();//arrêt et revient à zéro
      await sound.unloadAsync();//libérer la mémoire (destruction du playser)
    }

    navigation.goBack();
  };

  return (
  

    <ImageBackground
      source={require("../../assets/meditation/meditationBkg.png")}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.playerContainer}>
          <Text style={styles.title}>Méditation {type}</Text>
          <Text style={styles.subtitle}>
            {duration} minutes - {mode}
          </Text>

          <Pressable style={styles.playPause} onPress={togglePlayPause}>
            <Text style={styles.playPauseText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </Pressable>
        </View>
      )}
      <Button type="back" onPress={stopMeditation} />

      {/* Ajouter un bouton "suivant" lorsque la méditation est finie, qui aille vers les étagères */}
      {/* <Button
    onPress={() => navigation.navigate("Shelves")}
    label="Retour Etagère"
    type="primary"
    /> */}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  playerContainer: {
    alignItems: "center",
    gap: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },

  subtitle: {
    fontSize: 18,
    color: "#EEE",
  },

  playPause: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 40,
  },

  playPauseText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#224C4A",
  },
});
