// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnFV-RGKJI6AXui_SsVynFfanRxOSdk9I",
  authDomain: "ortho-website-project.firebaseapp.com",
  projectId: "ortho-website-project",
  storageBucket: "ortho-website-project.firebasestorage.app",
  messagingSenderId: "920028436910",
  appId: "1:920028436910:web:fac855372493a164cfd03f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);