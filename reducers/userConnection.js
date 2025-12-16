import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  username: '',
  userToken: '',
  userProgress: 0,
};

const userConnectionSlice = createSlice({
  name: 'userConnection',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isConnected = true;
      state.username = action.payload.username;
      state.userToken = action.payload.token;
      state.userProgress = action.payload.progressNb;
    },
    logout: (state) => {
      state.isConnected = false;
      state.username = '';
      state.userToken = '';
      state.userProgress = 0;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
    updateUserProgress: (state, action) => {
      state.userProgress = action.payload;
    },
  },
});

export const { login, logout, updateUsername, updateUserProgress } =
  userConnectionSlice.actions;
export default userConnectionSlice.reducer;
