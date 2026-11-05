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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Your code goes below this line.

// Functionality (cuz i was getting confused)
// ?q=
// ?u=
// quiz input
// 	- get responders to quiz
// 	- get quiz
// user input
// 	- get response to quiz
// when both
// 	- load quiz and response as text of quiz
// when deselect quiz
// 	- remove users
// when deselect either
// 	- clear quiz

const prefillQuiz = (new URLSearchParams(window.location.search)).get('q')
const prefillUser = (new URLSearchParams(window.location.search)).get('u')

let sF; // id of the currently selected form
let sU; // id of the currently selected user
let quizzesObj; // object of the list of all quizzes
let responsesObj; // object of the list of responses to the currently selected quiz
let quizObj; // object of the currently selected quiz
let quizData; // data object of the currently selected quiz
let responseObj; // object of the response of the currently selected user to the currently selected quiz
let responseData; // data object of the response of the currently selected user to the currently selected quiz
let i; // a counter variable

const dM = document.getElementById("main"); // for when javascript is on
const fJ = document.getElementById("failure"); // for when javascript is off
const fS = document.getElementById("formselecta"); // select what form
const uS = document.getElementById("submitta"); // submit button of the quiz

fJ.hidden = true;
dM.hidden = false;

quizzesObj = await getDocs(collection(db, "quizzes"));
console.log(quizzesObj);
for (const doc of quizzesObj.docs) {
	fillFormOption(doc.id, doc.data());
};

fS.addEventListener("change", (e) => {
	sF = e.target.value || null;
	unfillForm();
	unfillUserOptions();
	if (sF) {
		uS.hidden = false;
		fillUserOptions()
		console.log(`Form selected: ${sF}.`);
	} else {
		uS.hidden = true;
		console.log("Form deselected.");
	}
});

uS.addEventListener("change", (e) => {
	sU = e.target.value || null;
	unfillForm();
	if (sU) {
		fillFrom()
		console.log(`User selected: ${sU}.`);
	} else {
		console.log("Form deselected.");
	}
});

function fillFormOption(id, response) {
	console.log(`Recived quiz: "${response.title}"`);
	const fopt = document.createElement("option");
		fopt.textContent = response.title;
		fopt.value = id
	fS.appendChild(fopt);
	if (prefillQuiz === id) {
		fS.value = prefillQuiz;
		sF = prefillQuiz;
		fillUserOptions();
	};
};

async function fillUserOptions() {
	responsesObj = (await getDocs(collection(db, `quizzes/${sF}/responses`)));
	console.log(responsesObj);
	for (const doc of responsesObj.docs) {
		fillUserOption(doc.id, doc.data())
	};
};

function fillUserOption(id, response) {
	console.log(id, response)
	const uopt = document.createElement("option");
		uopt.textContent = response.name;
		uopt.value = id;
		uopt.classList = "uO";
	uS.appendChild(uopt);
	if (prefillUser === id) {
		uS.value = prefillUser;
		sU = prefillUser;
		fillFrom();
	};
}

async function fillFrom() {
	quizObj = await getDoc(doc(db, `quizzes/${sF}`));
	quizData = quizObj.data();
	responseObj = await getDoc(doc(db, `quizzes/${sF}/responses/${sU}`));
	responseData = responseObj.data()
	console.log(quizData);
	console.log(responseData);
	console.log(`quiz ${quizData.title} with id ${quizObj.id} has ${quizData.questions.length} questions`);
	console.log(`the first question of ${quizData.title} is "${quizData.questions[0].text}"`);
	console.log(`${responseData.name}'s answer to the first question of ${quizData.title} is "${responseData.answers[0]}"`);

	i = 0
	for (const q of quizData.questions) {
		fillQuestion(q);
		i = i + 1;
	};
};

function unfillForm() {
	console.log("fully implemented")
	const qP = qQ.querySelectorAll(".qP");
	qP.forEach(child => child.remove());
};

function unfillUserOptions() {
	console.log("fully implemented")
	const uO = uS.querySelectorAll(".uO");
	uO.forEach(child => child.remove());
};

function fillQuestion(q) {
	if (quizData.questions[i].text) {
		const laPeace = document.createElement("label");
			laPeace.textContent = q.text;
			laPeace.for = `q${i}`;
			laPeace.classList = "qP TextQuestionLabel";
			const laQuease = document.createElement("input");
				laQuease.id = `q${i}`;
				laQuease.name = `q${i}`;
				laQuease.classList = `qP TextQuestion ${i}`;
				laQuease.value = responseData.answers[i];
				laQuease.disabled = true;
			laPeace.appendChild(laQuease);
		qQ.appendChild(laPeace);
		console.log(`Filled question ${i} with "${q.text}"`)
		return "text";
	}

	else {
		console.error(`Failed to fill question ${i} from ${q}`)
		return false;
	}
};