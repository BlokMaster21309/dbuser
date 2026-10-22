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
let i;
let user = JSON.parse(localStorage.getItem("user"));

const qT = document.getElementById("qT");
const qQ = document.getElementById("qQ");
const qL = document.getElementById("qL");
const sI = document.getElementById("sI");

const quizzes = doc(db, "quizzes")

let quizRef = doc(db, "quizzes/quiz-1");
console.log("vhoriz");
const quizSnapshot = await getDoc(quizRef);
console.log("toneal");
const quiz = quizSnapshot.data();
console.log(quiz);
console.log(`this quiz has ${quiz.questions.length} questions`);
console.log(`the first question is "${quiz.questions[1].text}"`);

qL.innerHTML = quiz.title;
i = 0
for (const q of quiz.questions) {
	fillQuestion(q);
	i = i + 1;
};

function fillQuestion(q) {
	if (quiz.questions[i].text) {
		qQ.innerHTML += `
			<label for="q${i}">${q.text}
				<input id="q${i}" name="q${i}">
			</label>
		`;
		console.log(`Filled question ${i} with ${q.text}`)
		return "text";
	}

	if (quiz.questions[i].radio) {
		qQ.innerHTML += `
			<label for="q${i}">${q.text}
				<input id="q${i}" name="q${i}">
			</label>
		`;
		console.log(`Filled question ${i} with ${q.arbitrary}`)
		return "radio";
	}

	if (quiz.questions[i].arbitrary) {
		qQ.innerHTML += `
			<div id="q${i}">${q.arbitrary}</div>
		`;
		console.log(`Filled question ${i} with ${q.arbitrary}`)
		return "arbitrary";
	}

	else {
		console.error(`Failed to fill question ${i} from ${q}`)
		return false;
	}
}

auth, (user) => {
  if (user) {
    // User is signed in and session is valid
    console.log("User is authenticated:", user.uid);
  } else {
    // User is signed out or session has expired
    console.log("No valid authentication session found.");
		signInButton.hidden = false;
  }
};

signInButton.addEventListener("click", async () => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  console.log("Signed in as obj", result.user);
  console.log("Signed in as", result.user.email);
  user = result.user; // God save the quser!
	localStorage.setItem("user", JSON.stringify(result.user))
});