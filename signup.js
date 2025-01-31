import { auth } from "./firebase-config.js";  // Import Firebase Auth
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase authentication to create a new user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Redirect to chat page or dashboard after successful sign-up
            window.location.href = "profile2.html";  // Change to your chat page or app page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Sign-up failed: ${errorMessage}`);  // Display error message
        });
});
