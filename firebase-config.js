// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Your Firebase config (add your own credentials here)
const firebaseConfig = {
    apiKey: "AIzaSyDXfyMFl1Z_FpoS2YXwz2DHaxW1CmJLJy0",
    authDomain: "gitpages-b9241.firebaseapp.com",
    projectId: "gitpages-b9241",
    storageBucket: "gitpages-b9241.firebasestorage.app",
    messagingSenderId: "652265465365",
    appId: "1:652265465365:web:5f05f9f4df3952a36a101c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };  // Export the auth object for use in other files
