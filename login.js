// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7JHspwqzdDEhiXx6pEhGFoUS9wl3c03o",
    authDomain: "acclone.firebaseapp.com",
    projectId: "acclone",
    storageBucket: "acclone.appspot.com",
    messagingSenderId: "533342175725",
    appId: "1:533342175725:web:ddbdfe015b4cf29fee67e4",
    measurementId: "G-XZHP8Q4FSB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailLoginIn = document.getElementById("email-login");
const passwordLoginIn = document.getElementById("password-login");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", function() {
  const loginEmail = emailLoginIn.value;
  const loginPassword = passwordLoginIn.value;

  if (!loginEmail || !loginPassword) {
    window.alert("Please fill out all required fields.");
    return;
  }

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      window.alert("Success! Welcome back!");

      localStorage.setItem('userEmail', loginEmail);
      window.location.href = 'home.html'; 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during login:", errorCode, errorMessage);

      if (errorCode === 'auth/wrong-password') {
        window.alert("Incorrect password. Please try again.");
      } else if (errorCode === 'auth/user-not-found') {
        window.alert("No account found with this email. Please sign up first.");
      } else {
        window.alert("Error: " + errorMessage);
      }
    });
});

signupBtn.addEventListener("click", function() {
  window.location.href = 'signup.html';
});
