// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBs9rqcUoM_PIc1y9da-8fHKnOtb0OeaNg",
    authDomain: "customerbackend-fdbfa.firebaseapp.com",
    databaseURL: "https://customerbackend-fdbfa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "customerbackend-fdbfa",
    storageBucket: "customerbackend-fdbfa.appspot.com",
    messagingSenderId: "346489471997",
    appId: "1:346489471997:web:5e7a4a20840f7a88b90f94",
    measurementId: "G-5GMMXNK327"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
