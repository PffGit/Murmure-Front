import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import WelcomeScreen from "../screens/home/WelcomeScreen";

import HomeScreen from "../screens/home/HomeScreen";

import ShelvesScreen from "../screens/shelves/ShelvesScreen";

import MapScreen from "../screens/map/MapScreen";

//lessons
import LessonScreen from "../screens/lessons/LessonScreen";
import QuizzScreen from "../screens/lessons/QuizzScreen";
import FlashcardScreen from "../screens/lessons/FlashcardScreen";

// Meditations
import MeditationHomeScreen from "../screens/meditations/MeditationHomeScreen";
import MeditationPlayerScreen from "../screens/meditations/MeditationPlayerScreen";

// Respirations
import RespirationHomeScreen from "../screens/respirations/RespirationHomeScreen";
import RespirationCountdownScreen from "../screens/respirations/RespirationCountdownScreen";

// Chat
import ChatScreen from "../screens/chat/ChatScreen";

// Importer tous les screens : auth,lessons, loading, etc...

// Use different Stack navigators for web and native platforms
const Stack = Platform.OS === "web"
  ? createStackNavigator()
  : createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeScreen" //Ici chacun met le nom de son screen, comme ça qd on lance expoGo on arrive dessus. A la fin, on mettre "Home"

      screenOptions={{ headerShown: false }}
    >
      {/* Page de bienvenue paysage */}
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

      {/* Home et loading */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Shelves (étagère) */}
      <Stack.Screen name="Shelves" component={ShelvesScreen} />

      {/* Map */}
      <Stack.Screen name="Map" component={MapScreen} />

      {/* lesson */}
      <Stack.Screen name="lesson" component={LessonScreen} />
      <Stack.Screen name="quizz" component={QuizzScreen} />
      <Stack.Screen name="flashcard" component={FlashcardScreen} />

      {/* Meditation */}
      <Stack.Screen name="MeditationHome" component={MeditationHomeScreen} />
      <Stack.Screen
        name="MeditationPlayer"
        component={MeditationPlayerScreen}
      />

      {/* Respiration */}
      <Stack.Screen name="RespirationHome" component={RespirationHomeScreen} />
      <Stack.Screen
        name="RespirationCountdown"
        component={RespirationCountdownScreen}
      />

      {/* Chat */}
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
