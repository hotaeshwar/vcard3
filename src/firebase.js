// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdZEtn27kXjVIguNn_t0SDngVfvwEBVz8",
  authDomain: "vcard-ac68a.firebaseapp.com",
  projectId: "vcard-ac68a",
  storageBucket: "vcard-ac68a.firebasestorage.app",
  messagingSenderId: "725463323114",
  appId: "1:725463323114:web:b9c20f9faf23f9c2ba2293"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);