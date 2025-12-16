import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import WelcomeScreen from '../screens/home/WelcomeScreen';

import HomeScreen from '../screens/home/HomeScreen';

import CompteScreen from '../screens/compte/CompteScreen';

import ShelvesScreen from '../screens/shelves/ShelvesScreen';

import MapScreen from '../screens/map/MapScreen';

import LessonScreen from '../screens/lessons/LessonScreen';

import FlashcardScreen from '../screens/lessons/FlashcardScreen';

// Meditations
import MeditationHomeScreen from '../screens/meditations/MeditationHomeScreen';
import MeditationPlayerScreen from '../screens/meditations/MeditationPlayerScreen';

// Respirations
import RespirationHomeScreen from '../screens/respirations/RespirationHomeScreen';
import RespirationCountdownScreen from '../screens/respirations/RespirationCountdownScreen';

// Chat
import ChatScreen from '../screens/chat/ChatScreen';

//Compte
import SignUpScreen from '../screens/compte/SignUpScreen';
import SignInScreen from '../screens/compte/SignInScreen';

// Importer tous les screens : auth,lessons, loading, etc...
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeScreen" //Ici chacun met le nom de son screen, comme ça qd on lance expoGo on arrive dessus. A la fin, on mettre "WelcomeScreen"
      screenOptions={{ headerShown: false }}
    >
      {/* Page de bienvenue paysage */}
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

      {/* Home et loading */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Mon Compte */}
      <Stack.Screen name="Compte" component={CompteScreen} />

      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />

      {/* Shelves (étagère) */}
      <Stack.Screen name="Shelves" component={ShelvesScreen} />

      {/* Map */}
      <Stack.Screen name="Map" component={MapScreen} />

      {/* lesson */}
      <Stack.Screen name="Lesson" component={LessonScreen} />

      {/* flashcard */}
      <Stack.Screen name="Flashcard" component={FlashcardScreen} />

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

      {/* Chat affiché en modale, depuis le bas*/}
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
          keyboardHandlingEnabled: false, // <-- Ajoute ça
          // behavior: "position", //ne pas effacer, indispensable pour KeyAvoindingView
        }}
      />
    </Stack.Navigator>
  );
}
