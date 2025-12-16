import { SafeAreaView, View, Text, TextInput, StyleSheet, ImageBackground } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/userConnection";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import { BACKEND_ADDRESS } from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState("");

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    fetch(`${BACKEND_ADDRESS}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {

          // Sauvegarder dans Redux
          dispatch(
            login({
              username: data.username,
              token: data.token,
              progressNb: data.progressNb,
            })
          );

          // Sauvegarder le token dans AsyncStorage pour la détection de connexion
          AsyncStorage.setItem('userToken', data.token)
            .then(() => {
              console.log('[SignIn] ✅ Token sauvegardé dans AsyncStorage');
            })
            .catch((error) => {
              console.error('[SignIn] ❌ Erreur sauvegarde token:', error);
            });

          setWelcomeUsername(data.username);
          setShowWelcomeModal(true);
        } else {
          alert(data.error || "Identifiants incorrects");
        }
      })
      .catch((error) => {
        console.error("Erreur signin:", error);
        alert(`Impossible de se connecter. Détails: ${error.message}`);
      });
  };

  const handleWelcomeConfirm = () => {
    setShowWelcomeModal(false);
    navigation.navigate("Home");
  };

  return (
    <ImageBackground
      source={require('../../assets/paysage-bienvenue.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Connexion</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              label="Se connecter"
              type="primary"
              onPress={handleSignIn}
              style={styles.submitButton}
            />
          </View>

          <Button
            type="back"
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          />

          <ConfirmModal
            visible={showWelcomeModal}
            message={`Bonjour ${welcomeUsername} !`}
            onConfirm={handleWelcomeConfirm}
            singleButton={true}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#224C4A",
    marginBottom: 40,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#224C4A",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#507C79",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#224C4A",
  },
  submitButton: {
    marginTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});