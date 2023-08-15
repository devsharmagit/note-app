import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQzED3qFA3o_6WoguBe4PnwhyqXyhkdNc",
  authDomain: "note-taking-app-4abf0.firebaseapp.com",
  projectId: "note-taking-app-4abf0",
  storageBucket: "note-taking-app-4abf0.appspot.com",
  messagingSenderId: "17781644068",
  appId: "1:17781644068:web:12ba79078485d98ffb71b1"
};


const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app)

