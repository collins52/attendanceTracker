// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCfxCi77icybs3eHX9vvYZFoOk057O6Jxc",
  authDomain: "myloginpage-460dc.firebaseapp.com",
  databaseURL: "https://myloginpage-460dc-default-rtdb.firebaseio.com",
  projectId: "myloginpage-460dc",
  storageBucket: "myloginpage-460dc.appspot.com",
  messagingSenderId: "131030770903",
  appId: "1:131030770903:web:eb760494e216e67855bc92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login Button
document.getElementById("login").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.querySelector(".email").value.trim();
  const password = document.querySelector(".password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "adminPanel/adminPanel.html"; // Redirect to admin panel on successful login
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Reset Password Button
document.getElementById("resetPassword").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim(); //Get the email input value

  if (!email) {
    alert("Please enter your email address first.");
    return;
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      alert("This email is not registered.");
    } else {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email.");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Toggle Password Visibility
const visibilityIcon = document.querySelector(".visibilityIcon");
const passwordInput = document.querySelector(".password");
let visibility = false; // Default visibility state

visibilityIcon.addEventListener('click', function(){
    if(visibility){
        passwordInput.setAttribute('type', 'password');
        visibilityIcon.src = 'svgs/visibillityOn.svg'; // Change to visibility on icon
        visibility = false;
    }else{
        passwordInput.setAttribute('type', 'text');
        visibilityIcon.src = 'svgs/visibilityOff.svg'; // Change to visibility off icon
        visibility = true;
    }

})