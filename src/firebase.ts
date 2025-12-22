import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSNTVujV6pTIrbEF0SII-5WzO5EX0T9ns",
  authDomain: "sparktizen.firebaseapp.com",
  projectId: "sparktizen",
  storageBucket: "sparktizen.appspot.com",
  messagingSenderId: "709412770342",
  appId: "1:709412770342:web:9f99c32a6b3a2bed614ce7",
  measurementId: "G-9L4TMBWCFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
