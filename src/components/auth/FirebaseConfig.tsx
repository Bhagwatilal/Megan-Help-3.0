// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_llRD1q_6d5l6aOP9b3O6Lkkh4q3Mvr8",
  authDomain: "meganhelp-33979.firebaseapp.com",
  projectId: "meganhelp-33979",
  storageBucket: "meganhelp-33979.firebasestorage.app",
  messagingSenderId: "807938180483",
  appId: "1:807938180483:web:3790e5bb75a278c60122b6",
  measurementId: "G-3TJMVXMXG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
