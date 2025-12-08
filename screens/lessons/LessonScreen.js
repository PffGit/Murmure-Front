import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../components/Button";
import Label from "../../components/Label";

// const chapterTitle = "Qu'est ce que l'instant present ?";
// const chapterContent =
//   "L’instant présent désigne le moment que tu vis ici et maintenant, sans te perdre dans le passé ni anticiper l’avenir. C’est ce que tu ressens, vois, entends et vis à cet instant précis. Se concentrer sur l’instant présent aide à réduire le stress et l’anxiété, car tu ne rumines plus ce qui a été ou ce qui pourrait arriver. Vivre l’instant présent, c’est être pleinement conscient de soi et du monde autour de soi, ici et maintenant. Es-tu vraiment dans l’instant présent ?";

const chapters = [
  {
    title: "Bienvenue dans la foret",
    logo: "🌳",
    content: `Murmure vous guide à travers un parcours immersif qui vous aide à explorer vos émotions, comprendre l’anxiété, pratiquer le lâcher-prise et vivre pleinement l’instant présent. 
  
À chaque étape, des conseils et exercices vous accompagnent pour retrouver calme, sérénité et bien-être. A vous de jouer !`,
  },
  {
    title: "Chapitre 1: Qu'est ce que l'instant present ?",
    logo: "🌏",
    content: `L’instant présent désigne le moment que tu vis ici et maintenant, sans te perdre dans le passé ni anticiper l’avenir. 

C’est ce que tu ressens, vois, entends et vis à cet instant précis. Se concentrer sur l’instant présent aide à réduire le stress et l’anxiété, car tu ne rumines plus ce qui a été ou ce qui pourrait arriver. 

Vivre l’instant présent, c’est être pleinement conscient de soi et du monde autour de soi, ici et maintenant. Es-tu vraiment dans l’instant présent ?`,
    quizz: {
      question: "Quand tu marches dehors, tu…",
      answers: [
        "Regarde ton téléphone et pense à ta to-do list",
        "Observe un peu autour de toi, mais ton esprit vagabonde",
        "Sens le vent, entends les sons et profites de chaque pas",
      ],
    },
    flashcard:
      "L’instant présent désigne le moment que tu vis ici et maintenant, sans te perdre dans le passé ni anticiper l’avenir. C’est ce que tu ressens, vois, entends et vis à cet instant précis. Se concentrer sur l’instant présent aide à réduire le stress et l’anxiété, car tu ne rumines plus ce qui a été ou ce qui pourrait arriver. Vivre l’instant présent, c’est être pleinement conscient de soi et du monde autour de soi, ici et maintenant. Es-tu vraiment dans l’instant présent ?",
  },
  // Add more chapters as needed
];

export default function LessonScreen({ navigation, route }) {
  const insets = useSafeAreaInsets(); //utilisé pour recuperer les dimension de la safeArea de l'ecran

  const chapterIndex = route?.params?.lessonNumber ?? 0; // Use React navigation parameters. Default to 0 if route parameter not specified
  const chapter = chapters[chapterIndex];

  return (
    <View style={styles.mainContainer}>
      {/* Top + marginTop dynamic en fonction de l'inset.top */}
      <Image style={[styles.coco, { top: Math.max(insets.top, 20) }]} source={require("../../assets/coco.png")} />
      <View style={[styles.contentContainer, { marginTop: Math.max(insets.top + 120, 20) }]}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{chapter.title}</Text>
          <Text style={styles.titleLogo}>{chapter.logo}</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.contentText}>{chapter.content}</Text>
        </ScrollView>
      </View>

      {/* marginBottom dynamic en fonction de l'inset.bottom */}
      <View style={[styles.buttonContainer, { marginBottom: 20 + insets.bottom }]}>
        <Button onPress={() => navigation.goBack()} type="back" />
        <Button onPress={() => navigation.navigate("quizz")} type="next" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "lightgreen",
    position: "relative", //needed for "coco position:absolute" to work
  },
  coco: {
    position: "absolute", //needed to put coco where we want in the main container. Defaut position behavior top: 0
    right: "10%", //place it 10% to the right of the screen
    width: 130,
    height: 130,
    transform: [{ scaleX: -1 }], //flip image horizontaly
    zIndex: 2, // This define the priority of the image (2 > 1 so image is in front of contentContainer)
  },
  contentContainer: {
    flex: 1, // Donne tout la hauteur restante au contenu (apres le margin top pour coco et le )
    marginTop: 140,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    zIndex: 1,
  },
  title: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "600",
  },
  titleLogo: {
    fontSize: 34,
  },
  contentText: {
    fontSize: 18,
    color: "#666",
    lineHeight: 28,
  },
  buttonContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
});
