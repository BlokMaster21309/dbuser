import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const mew = document.getElementById("nyaa~"); // :3
const sI = document.getElementById("sI"); // sign in button
const qS = document.getElementById("submissibles"); // submit button of the quiz

let userp; // thats not how you spell usurp >:[

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
		userp = user;
		mew.textContent = "Fill Out";
		sI.hidden = true;
		qS.hidden = false;
  } else {
    console.log("No valid user session found.");
		mew.textContent = "View";
		sI.hidden = false;
		qS.hidden = true;
  }
});

sI.addEventListener("click", async () => {
  result = await signInWithPopup(auth, new GoogleAuthProvider());
  console.log("Signed in as obj", result.user);
  console.log("Signed in as", result.user.email);
});