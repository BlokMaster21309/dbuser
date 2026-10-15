import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Your code goes below this line.
const quizRef = doc(db, "quizzes/quiz-1");
console.log("vhoriz");
const quizSnapshot = await getDoc(quizRef);
console.log("toneal");
const quiz = quizSnapshot.data();
console.log(quiz);
console.log("this quiz has", quiz.questions.length, "questions");
console.log(`the first question is "${quiz.questions[1].text}"`);