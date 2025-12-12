import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  username: '',
  userToken: '',
};

const userConnectionSlice = createSlice({
  name: 'userConnection',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isConnected = true;
      state.username = action.payload.username;
      state.userToken = action.payload.token;
    },
    logout: (state) => {
      state.isConnected = false;
      state.username = '';
      state.userToken = '';
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { login, logout, updateUsername } = userConnectionSlice.actions;
export default userConnectionSlice.reducer;