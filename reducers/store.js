import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userConnectionReducer from './userConnection';

// Configuration de Redux Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userConnection'], // Persiste seulement userConnection
};

// Créer le reducer persisté
const persistedReducer = persistReducer(persistConfig, userConnectionReducer);

// Configurer le store avec le reducer persisté
const store = configureStore({
  reducer: {
    userConnection: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions de redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Créer le persistor
export const persistor = persistStore(store);
export default store;