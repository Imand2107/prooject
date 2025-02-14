import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAvj6RJtmIRWyBRAG1eA-kp6xn7c48BZEA",
  authDomain: "final-year-project-b40d9.firebaseapp.com",
  projectId: "final-year-project-b40d9",
  storageBucket: "final-year-project-b40d9.firebasestorage.app",
  messagingSenderId: "416105235822",
  appId: "1:416105235822:android:1e6839a541f99390f0ad7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to LOCAL.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); 