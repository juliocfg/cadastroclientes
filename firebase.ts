import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlKGaVLl5pk3uTuaLRn8B-SifSwKbTKRU",
  authDomain: "cadastroclientes-9c73a.firebaseapp.com",
  projectId: "cadastroclientes-9c73a",
  storageBucket: "cadastroclientes-9c73a.firebasestorage.app",
  messagingSenderId: "724847380752",
  appId: "1:724847380752:web:d8c60385ee886ef75b7d95",
  measurementId: "G-YPX6QJ0XCS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);