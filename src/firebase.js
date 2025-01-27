
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyA7hchD_OCFOmOsc99Sf71Yahu21aqHDMQ",
  authDomain: "techmart-3e304.firebaseapp.com",
  projectId: "techmart-3e304",
  storageBucket: "techmart-3e304.firebasestorage.app",
  messagingSenderId: "54956868778",
  appId: "1:54956868778:web:56371e8537021258827cd3",
  measurementId: "G-LFDM9CW086"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const database = getDatabase(app);

export {auth, database};