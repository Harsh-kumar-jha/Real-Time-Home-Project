// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4wiMI0okvgUiDh99oklHvsaP6b08nYhY",
  authDomain: "realtimehome-42c36.firebaseapp.com",
  projectId: "realtimehome-42c36",
  storageBucket: "realtimehome-42c36.appspot.com",
  messagingSenderId: "301297928280",
  appId: "1:301297928280:web:7dbef8271eeb7fe11e222d",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
