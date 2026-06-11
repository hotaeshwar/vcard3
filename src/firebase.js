// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRtqbrTGZZNzC0xorbW91hP_8-wor8E4Q",
  authDomain: "vcard2-216bb.firebaseapp.com",
  projectId: "vcard2-216bb",
  storageBucket: "vcard2-216bb.firebasestorage.app",
  messagingSenderId: "859812638611",
  appId: "1:859812638611:web:4d9f30fee54de33cd3c266"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);