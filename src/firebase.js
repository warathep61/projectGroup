// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; //เก่ง



const firebaseConfig = {
  apiKey: "AIzaSyBPY4m4zwa6PX2g1A2tJee3Vs-JjlpQXUs",
  authDomain: "project-all-reactjs-e5ab6.firebaseapp.com",
  projectId: "project-all-reactjs-e5ab6",
  storageBucket: "project-all-reactjs-e5ab6.appspot.com",
  messagingSenderId: "526028601522",
  appId: "1:526028601522:web:ec378e01f7b488570931ab",
  measurementId: "G-MNSB2RPLY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const storage = getStorage(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider}