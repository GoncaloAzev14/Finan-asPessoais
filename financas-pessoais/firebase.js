// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Substitua pelos dados que copiou da consola do Firebase (Project Settings > General > Your apps)
const firebaseConfig = {
    apiKey: "AIzaSyDVjbzH2N3q3rShA6GmenhKUzdsy_BjmK8",
    authDomain: "personalfinances-4b85f.firebaseapp.com",
    projectId: "personalfinances-4b85f",
    storageBucket: "personalfinances-4b85f.firebasestorage.app",
    messagingSenderId: "1062160953688",
    appId: "1:1062160953688:web:37741daf0c2e64d0d0352d"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);