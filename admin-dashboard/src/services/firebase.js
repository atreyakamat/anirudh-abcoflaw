import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if we have an API key present before initializing real engines
const hasKeys = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

let app;
let auth = null;
let db = null;

if (hasKeys) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("⚠️ Firebase keys are missing. Dashboard running in offline mockup mode.");
  // Provide empty dummy objects so consumer imports do not break with undefined access errors
  auth = {};
  db = {};
}

export { auth, db, hasKeys };
