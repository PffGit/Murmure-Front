import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    index: 1,
    logo: '🌏',
    title: "Chapitre 1: pourquoi tu n'as pas fetch les data ?",
    content:
      "Est ce que tu as oublié d'allumer ton back ?\nOu bien tu n'as pas lancé le script pour ajouter les datas à mongo ?\n\nℹ️ Regarde le readme sur le back 😉\n\nPour te punir voila un lorem ipsum\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam scelerisque nunc ac malesuada sollicitudin. Mauris sit amet condimentum tortor. Aliquam volutpat ornare ipsum, ac congue ligula tempus sit amet. Vestibulum pretium nunc lobortis condimentum finibus. Cras in arcu accumsan, fermentum tellus in, volutpat enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a consectetur lectus. Cras purus arcu, varius vel massa eu, eleifend lobortis tortor. Donec vel maximus diam, sed lacinia arcu. Sed quis nulla tempor, condimentum risus eu, varius lacus. Morbi ac iaculis lorem, at mollis ipsum. Nam in leo ante.",
    quiz: {
      questions: [
        {
          question: 'Quand tu marches dehors, tu…',
          answers: [
            "Oublie t'es chaussures",
            'Oublie la poele allumée sur le feu',
            "Oublie de tirer la chasse d'eau",
          ],
        },
        {
          question: 'Pendant les repas, tu…',
          answers: [
            "Oublie t'es chaussures",
            'Oublie la poele allumée sur le feu',
            "Oublie de tirer la chasse d'eau",
          ],
        },
        {
          question: 'Quand une émotion forte arrive, tu…',
          answers: [
            "Oublie t'es chaussures",
            'Oublie la poele allumée sur le feu',
            "Oublie de tirer la chasse d'eau",
          ],
        },
      ],
      results: [
        'Tu devrai marcher pieds nu',
        'Tu devrai souscrire à une assurance !',
        'Va plutot aux toilettes au bureau',
      ],
    },
    flashcard: {
      title: "Qu'est ce qu'on as retenu ?",
      definition: '🔍 bah pas grand chose\n',
      why: '🎯 Que tu est globalement plutot douée en quiz \n',
      keyConcept: "🧩 Et que t'oublie parfois des choses\n",
      exemple: '⚡️ Comme le backend par exemple\n',
      exercice: "📝 Ce message s'autodetruira dans 1312 jours !",
    },
  }
]

const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    setIndividualChapter: (state, action) => {
      state.push(action.payload);
    },
    setAllChapters: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { setIndividualChapter, setAllChapters } = chaptersSlice.actions;

export default chaptersSlice.reducer;
