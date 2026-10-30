import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
	onAuthStateChanged,
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
const prefillQuiz = (new URLSearchParams(window.location.search)).get('quiz')

let response;
let sF;
let id;
let quizRef;
let quizSnapshot;
let quiz;
let i;
let user = JSON.parse(localStorage.getItem("user"));

const qT = document.getElementById("qT");
const qQ = document.getElementById("qQ");
const qL = document.getElementById("qL");
const sI = document.getElementById("sI");
const fS = document.getElementById("formselecta");
const dM = document.getElementById("main");
const fJ = document.getElementById("failure");

fJ.hidden = true;
dM.hidden = false;

const quizzes = await getDocs(collection(db, "quizzes"));
console.log(quizzes);
for (let responseDoc of quizzes.docs) {
  response = responseDoc.data();
	id = responseDoc.id;
	fillFormOption();
};

fS.addEventListener("change", (e) => {
		if (e.target.value) {
			sF = e.target.value;
			unfillForm()
			fillFrom()
			console.log(`Form selected: ${e.target.value}.`);
		} else {
			sF = null;
			unfillForm()
			console.log("Form deselected.");
		}
	});

async function fillFrom() {
	console.log(`quizzes/${sF}`);
	quizRef = doc(db, `quizzes/${sF}`);
	console.log(quizRef);
	quizSnapshot = await getDoc(quizRef);
	console.log(quizSnapshot)
	quiz = quizSnapshot.data();
	console.log(quiz);
	console.log(`this quiz has ${quiz.questions.length} questions`);
	console.log(`the first question is "${quiz.questions[1].text}"`);

	i = 0
	for (const q of quiz.questions) {
		fillQuestion(q);
		i = i + 1;
	};
};

function unfillForm() {
	console.log("half implemented")
	const qP = qQ.querySelectorAll(".qP");
	qP.forEach(child => child.remove());
}

function fillFormOption() {
  console.log(`Recived quiz: "${response.title}"`);
	const fopt = document.createElement("option");
		fopt.textContent = response.title;
		fopt.value = id
	fS.appendChild(fopt);
}

function fillQuestion(q) {
	if (quiz.questions[i].text) {
		const laPeace = document.createElement("label");
			laPeace.textContent = q.text;
			laPeace.for = `q${i}`;
			laPeace.classList = "qP TextQuestionLabel";
			const laQuease = document.createElement("input");
				laQuease.id = `q${i}`;
				laQuease.name = `q${i}`;
				laQuease.classList = "qP TextQuestion";
			laPeace.appendChild(laQuease);
		qQ.appendChild(laPeace);
		console.log(`Filled question ${i} with ${q.text}`)
		return "text";
	}

	if (quiz.questions[i].radio) {
		qQ.innerHTML += `
			<label for="q${i}">${q.text}
				<input id="q${i}" name="q${i}">
			</label>
		`;
		console.log(`Filled question ${i} with ${q.radio}`)
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
  } else {
    console.log("No valid user session found.");
		sI.hidden = false;
  }
});

sI.addEventListener("click", async () => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  console.log("Signed in as obj", result.user);
  console.log("Signed in as", result.user.email);
  user = result.user; // God save the quser!
	localStorage.setItem("user", JSON.stringify(result.user))
});