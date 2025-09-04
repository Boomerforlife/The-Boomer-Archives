// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBh-IWMREVXt9QVl0lYn5HKi9Rd8pxB7c4",
  authDomain: "blog-nation-5c2df.firebaseapp.com",
  projectId: "blog-nation-5c2df",
  storageBucket: "blog-nation-5c2df.firebasestorage.app",
  messagingSenderId: "749764183094",
  appId: "1:749764183094:web:0515b133bd281777d78497",
  measurementId: "G-90SS4WLNBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default firebaseConfig;
