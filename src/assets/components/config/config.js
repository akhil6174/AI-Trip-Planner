// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Corrected import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjVIm6wpf60PN0GTBWxDc8hJff_-9gxVE",
  authDomain: "ai-tripplanner-ca738.firebaseapp.com",
  projectId: "ai-tripplanner-ca738",
  storageBucket: "ai-tripplanner-ca738.appspot.com", // ✅ Corrected from .app to .app**spot.com**
  messagingSenderId: "1070440902418",
  appId: "1:1070440902418:web:19014a494360e121ce4dcb",
  measurementId: "G-GWRF2K48EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Uncommented to use Firestore

export { db};
