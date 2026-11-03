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

let response; // full response from initial query
let sF; // why are we naming our varables how we name our objects?
// let id; // id of the current quiz
let myResponseRef; // reference of the response, probably also not needed
let myResponse; // response to be set at the location defined previously
let quiz; // the object of the currently selected quiz
let i; // a counter variable
let answers; // the answers of the quiz

const sI = document.getElementById("sI"); // sign in button
const dM = document.getElementById("main"); // for when javascript is on
const fJ = document.getElementById("failure"); // for when javascript is off
const qS = document.getElementById("submissibles"); // submit button of the quiz
const rS = document.getElementById("pookieReese"); // reset form
const qL = document.getElementById("qL"); // legend of the quiz
const quizId = document.getElementById("id"); // input for id of the quiz
const questions = document.getElementById("questions"); // feildset of questions of the quiz
const id = document.getElementById("id"); // input for id of the quiz
const title = document.getElementById("title"); // input for title of the quiz
const aT = document.getElementById("aT"); // button to add a text question to the quiz
const qQ = document.getElementById("qQ"); // feildset of the quiz

fJ.hidden = true;
dM.hidden = false;

onAuthChange((user) => {
	if (user) {
		console.log("Logged in on this page:", user.uid);
		sI.hidden = true;
		qS.hidden = false;
	} else {
		console.log("Logged out on this page");
		sI.hidden = false;
		qS.hidden = true;
	}
});

aT.addEventListener("click", async () => {
	const exceptional = document.createElement("label");
		exceptional.textContent = "Text Question: ";
		exceptional.classList = "question TextQuestionLabel";
		const frop = document.createElement("input");
			frop.placeholder = "The text of the question"
			frop.classList = "question TextQuestionText"
		exceptional.appendChild(frop);
	questions.appendChild(exceptional);
	console.log("Added text question");
});

rS.addEventListener("click", async () => {
	const question = form.querySelectorAll(".question");
	question.forEach(child => child.remove());
	console.log("Reset Form");
});