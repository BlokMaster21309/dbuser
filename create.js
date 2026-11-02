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