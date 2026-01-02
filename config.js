// Configuration de l'adresse backend
// En développement local: utilisez votre IP locale pour Expo Go ou localhost pour web
// En production: utilisez l'URL de votre backend déployé sur Render

// Développement local
// export const BACKEND_ADDRESS = "http://192.168.1.13:3000";
// export const BACKEND_ADDRESS = "http://localhost:3000";

// Production (à remplacer par votre URL Render après déploiement)
export const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.13:3000";