import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
	onAuthChange,
	userp
} from "./auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Your code goes below this line.
const prefillQuiz = (new URLSearchParams(window.location.search)).get('q')

let response; // full response from initial query
let sF; // why are we naming our varables how we name our objects?
let id; // id of the current quiz
let myResponseRef; // reference of the response, probably also not needed
let myResponse; // response to be set at the location defined previously
let quiz; // the object of the currently selected quiz
let i; // a counter variable
let answers; // the answers of the quiz

const qQ = document.getElementById("qQ"); // feildset of the quiz
const qL = document.getElementById("qL"); // legend of the quiz
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
		sF = e.target.value || null;
		unfillForm()
		if (e.target.value) {
			fillFrom()
			qS.textContent = "Submit";
			if (userp) qS.hidden = false;
			console.log(`Form selected: ${e.target.value}.`);
		} else {
			qS.hidden = true;
			if (!userp) 
			console.log("Form deselected.");
		}
	});

async function fillFrom() {
	quiz = (await getDoc(doc(db, `quizzes/${sF}`))).data();
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
	if (prefillQuiz) {
		fS.value = prefillQuiz;
		sF = prefillQuiz;
		fillFrom();
	};
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
				laQuease.classList = `qP TextQuestion ${i}`;
			laPeace.appendChild(laQuease);
		qQ.appendChild(laPeace);
		console.log(`Filled question ${i} with "${q.text}"`)
		return "text";
	}

	else {
		console.error(`Failed to fill question ${i} from ${q}`)
		return false;
	}
}

qS.addEventListener("click", async () => {
	answers = [];
	for (const TextQuestion of qQ.querySelectorAll(".TextQuestion")) {
		answers.push(TextQuestion.value)
	}
	console.log (answers)
	myResponseRef = doc(db, `quizzes/${sF}/responses/${userp.uid}`);
	myResponse = {
  name : userp.displayName,
  answers : answers
};
console.log(myResponse);
await setDoc(myResponseRef, myResponse);
qS.textContent = "Submit Again!";
console.log("God Saved The User!");
})

onAuthChange((user) => {
  if (user) {
    console.log("Logged in on this page:", user.uid);
		mew.textContent = "Fill Out";
		sI.hidden = true;
		if (quiz) qS.hidden = false;
  } else {
    console.log("Logged out on this page");
		mew.textContent = "View";
		sI.hidden = false;
		qS.hidden = true;
  }
});