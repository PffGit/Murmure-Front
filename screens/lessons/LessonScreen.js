import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import ConfirmModal from "../../components/ConfirmModal";
import Button from "../../components/Button";
import Label from "../../components/Label";

export default function LessonScreen({ navigation, route }) {
  const insets = useSafeAreaInsets(); //used to get screen SafeArea dimensions
  const [contentToDisplay, setContentToDisplay] = useState("lesson");
  const [quizzQuestionIndex, setQuizzQuestionIndex] = useState(0);
  const [quizzQuestionChoice, setQuizzQuestionChoice] = useState([]);

  const [showExitPopup, setShowExitPopup] = useState(false); // popup sortie

  const chapters = [
    {
      title: "Bienvenue dans la foret",
      logo: "🌳",
      content: `Murmure vous guide à travers un parcours immersif qui vous aide à explorer vos émotions, comprendre l’anxiété, pratiquer le lâcher-prise et vivre pleinement l’instant présent. \n
  À chaque étape, des conseils et exercices vous accompagnent pour retrouver calme, sérénité et bien-être. \n
  A vous de jouer !`,
    },
    {
      title: "Chapitre 1: Qu'est ce que l'instant present ?",
      logo: "🌏",
      content: `L’instant présent désigne le moment que tu vis ici et maintenant, sans te perdre dans le passé ni anticiper l’avenir. \n
  C’est ce que tu ressens, vois, entends et vis à cet instant précis. Se concentrer sur l’instant présent aide à réduire le stress et l’anxiété, car tu ne rumines plus ce qui a été ou ce qui pourrait arriver. \n
  Vivre l’instant présent, c’est être pleinement conscient de soi et du monde autour de soi, ici et maintenant. \n
  Es-tu vraiment dans l’instant présent ?`,
      quizz: [
        {
          question: "Quand tu marches dehors, tu…",
          answers: [
            "Regarde ton téléphone et pense à ta to-do list",
            "Observe un peu autour de toi, mais ton esprit vagabonde",
            "Sens le vent, entends les sons et profites de chaque pas",
          ],
        },
        {
          question: "Pendant les repas, tu…",
          answers: [
            "Manges en vitesse sans vraiment prêter attention",
            "Manges tout en réfléchissant à ce que tu dois faire après",
            "Savoures chaque bouchée et remarques les goûts et textures",
          ],
        },
        {
          question: "Quand une émotion forte arrive, tu…",
          answers: [
            "La repousses ou la fuis",
            "La remarques vaguement mais passes vite à autre chose",
            "Tu l’accueilles, tu respires et observes ce que tu ressens",
          ],
        },
      ],
      quizzResult: [
        "Esprit souvent ailleurs, tu as besoin d’exercices de pleine conscience.",
        "Tu pratiques un peu, mais tu peux t’améliorer avec des micro-pauses d’attention.",
        "Tu es déjà bien connecté à l’instant présent, continue à cultiver cette habitude !",
      ],
      flashcard:
        "L’instant présent désigne le moment que tu vis ici et maintenant, sans te perdre dans le passé ni anticiper l’avenir. C’est ce que tu ressens, vois, entends et vis à cet instant précis. Se concentrer sur l’instant présent aide à réduire le stress et l’anxiété, car tu ne rumines plus ce qui a été ou ce qui pourrait arriver. Vivre l’instant présent, c’est être pleinement conscient de soi et du monde autour de soi, ici et maintenant. Es-tu vraiment dans l’instant présent ?",
    },
    // Add more chapters as needed
  ];

  // Use React navigation parameters. Default to 0 if route parameter not specified
  const chapterIndex = route?.params?.lessonNumber ?? 0;
  const chapter = chapters[chapterIndex];

  function DisplayLesson() {
    return (
      <>
        <View style={styles.title}>
          <Text style={styles.titleText}>{chapter.title}</Text>
          <Text style={styles.titleLogo}>{chapter.logo}</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.contentText}>{chapter.content}</Text>
        </ScrollView>
      </>
    );
  }

  function DisplayQuizz() {
    function handleQuestionChoice(qIndex, choice) {
      const updatedChoices = [...quizzQuestionChoice];
      updatedChoices[qIndex] = choice;
      setQuizzQuestionChoice(updatedChoices);
      console.log("quizz choices:", updatedChoices);
      updatedChoices.length >= chapter.quizz.length
        ? setContentToDisplay("quizzResult")
        : setQuizzQuestionIndex(quizzQuestionIndex + 1);
    }

    //quizzQuestionIndex >= chapter.quizz.length && setQuizzQuestionIndex(0);
    const quizzButtons = chapter.quizz[quizzQuestionIndex].answers.map((e, i) => {
      return <Button key={i} onPress={() => handleQuestionChoice(quizzQuestionIndex, i)} type="question" label={e} />;
    });

    return (
      <>
        <View style={styles.title}>
          <Text style={styles.titleQuestion}>{chapter.quizz[quizzQuestionIndex].question}</Text>
        </View>
        <View style={styles.questionContainer}>{quizzButtons}</View>
      </>
    );
  }

  function DisplayQuizzResult() {
    function findMode(arr) {
      const counts = {};
      for (const element of arr) {
        counts[element] = (counts[element] || 0) + 1;
      }

      // create an object with frequency of answer selection
      const counts2 = arr.reduce((acc, val) => ((acc[val] = (acc[val] || 0) + 1), acc), {});
      console.log(counts2);

      // get the most frequent value of each key
      const maxFrequency = Math.max(...Object.values(counts));

      // return the objects with the most frequency
      const modes = Object.keys(counts)
        .filter((element) => counts[element] === maxFrequency)
        .map((element) => parseInt(element));

      // Return 1 if there is no clear mode (aka a tie)
      return modes.length === 1 ? modes[0] : 1;
    }

    const result = chapter.quizzResult[findMode(quizzQuestionChoice)];

    return (
      <>
        <View style={styles.title}>
          <Text style={styles.titleText}>Resultat du quizz</Text>
        </View>
        <Text style={styles.contentText}>{result}</Text>
      </>
    );
  }

  function handleNextButton() {
    switch (contentToDisplay) {
      case "lesson":
        setContentToDisplay("quizz");
        break;
      case "quizzResult":
        setContentToDisplay("flashcard");
        break;
      case "flashcard":
        navigation.navigate("Map");
        break;
    }

    // contentToDisplay === "lesson"
    //   ? setContentToDisplay("quizz")
    //   : contentToDisplay === "quizzResult"
    //   ? setContentToDisplay("flashcard")
    //   : setContentToDisplay("quizz");
  }

  return (
    <View style={styles.mainContainer}>
      {/* Top + marginTop dynamic en fonction de l'inset.top */}
      <Label onPress={() => navigation.navigate("Quizz")} style={[styles.coco, { top: Math.max(insets.top, 20) }]}>
        <Image source={require("../../assets/coco.png")} />
      </Label>
      <View style={[styles.contentContainer, { marginTop: Math.max(insets.top + 120, 20) }]}>
        {(() => {
          switch (contentToDisplay) {
            case "lesson":
              return DisplayLesson();
            case "quizz":
              return DisplayQuizz();
            case "quizzResult":
              return DisplayQuizzResult();
            case "flashcard":
              return <Text>Flashcard</Text>;
          }
        })()}
      </View>

      {/* marginBottom dynamic en fonction de l'inset.bottom */}
      <View style={[styles.buttonContainer, { marginBottom: 20 + insets.bottom }]}>
        <Button onPress={() => navigation.goBack()} type="primary" label="Quitter" />
        {contentToDisplay !== "quizz" && <Button onPress={() => handleNextButton()} type="primary" label="Suivant" />}
      </View>

      <ConfirmModal
        visible={showExitPopup}
        message="Voulez-vous arrêter la leçon ?"
        onCancel={() => setShowExitPopup(false)}
        onConfirm={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // style for the global screen, coco positioning, contentContainer, buttons
  mainContainer: {
    flex: 1,
    backgroundColor: "#95BE96",
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
    marginBottom: 0,
    padding: 20,
    zIndex: 1,
  },
  buttonContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  // style for Lesson/Result/Flashcard inside of contentContainer
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
  // style for Quizz inside of contentContainer
  titleQuestion: {
    fontSize: 18,
    fontWeight: "600",
  },
  questionContainer: {
    fontSize: 14,
    lineHeight: 28,
  },
});
