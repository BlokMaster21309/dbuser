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

let response; // full response from initial query
let result; // full result from auth
let sF; // why are we naming our varables how we name our objects?
let id; // id of the current quiz
let quizRef; // neither of these variables are needed, will refactor to remove next commit
let quizSnapshot; // <--/
let quiz; // the object of the currently selected quiz
let i; // a counter variable
let userp; // thats not how you spell usurp >:[

const qQ = document.getElementById("qQ"); // feildset of the quiz
const qL = document.getElementById("qL"); // legend of the quiz
const sI = document.getElementById("sI"); // sign in button
const qS = document.getElementById("submissibles"); // submit button of the quiz
const fS = document.getElementById("formselecta"); // select what form
const dM = document.getElementById("main"); // for when javascript is on
const fJ = document.getElementById("failure"); // for when javascript is off
const mew = document.getElementById("nyaa~"); // :3

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

	else {
		console.error(`Failed to fill question ${i} from ${q}`)
		return false;
	}
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
		userp = user;
		mew.textContent = "Fill Out";
		sI.hidden = true;
  } else {
    console.log("No valid user session found.");
		mew.textContent = "View";
		sI.hidden = false;
  }
});

sI.addEventListener("click", async () => {
  result = await signInWithPopup(auth, new GoogleAuthProvider());
  console.log("Signed in as obj", result.user);
  console.log("Signed in as", result.user.email);
});