import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

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
