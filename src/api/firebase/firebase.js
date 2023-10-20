// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7S7af5yDKZFhoV2VuIOA2uQVAnnFos9s",
    authDomain: "board-86631.firebaseapp.com",
    projectId: "board-86631",
    storageBucket: "board-86631.appspot.com",
    messagingSenderId: "282073995382",
    appId: "1:282073995382:web:58210217ff42674fd96757",
    measurementId: "G-68XTBHKQYT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);