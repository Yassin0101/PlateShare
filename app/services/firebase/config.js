// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyvAB9lBraI_q4OiGKjo6v7LWMwUPCqCo",
  authDomain: "ubereatsclone-14869.firebaseapp.com",
  projectId: "ubereatsclone-14869",
  storageBucket: "ubereatsclone-14869.firebasestorage.app",
  messagingSenderId: "884462268479",
  appId: "1:884462268479:web:b3943107b940cca45a888a",
  measurementId: "G-ZTCFHZ9QHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; //