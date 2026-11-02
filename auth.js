import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const sI = document.getElementById("sI"); // sign in button

export let userp; // thats not how you spell usurp >:[
export let result; // full result from auth
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    userp = user;
    if (callback) callback(user);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
		userp = user;
  } else {
    console.log("No valid user session found.");
  }
});

sI.addEventListener("click", async () => {
  result = await signInWithPopup(auth, new GoogleAuthProvider());
  console.log("Signed in as obj", result.user);
  console.log("Signed in as", result.user.email);
});