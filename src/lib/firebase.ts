import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Provide via Vite env vars (.env.local or .env) — VITE_FIREBASE_*
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;

export const isFirebaseConfigured = () => Boolean(config.apiKey && config.projectId);

export const getDb = (): Firestore | null => {
  if (!isFirebaseConfigured()) return null;
  if (!app) app = getApps()[0] ?? initializeApp(config);
  if (!dbInstance) dbInstance = getFirestore(app);
  if (!analyticsInstance && typeof window !== "undefined") {
    // Only initialize analytics on the client side
    analyticsInstance = getAnalytics(app);
  }
  return dbInstance;
};
