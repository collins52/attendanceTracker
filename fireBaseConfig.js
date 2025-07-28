// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfxCi77icybs3eHX9vvYZFoOk057O6Jxc",
  authDomain: "myloginpage-460dc.firebaseapp.com",
  databaseURL: "https://myloginpage-460dc-default-rtdb.firebaseio.com",
  projectId: "myloginpage-460dc",
  storageBucket: "myloginpage-460dc.appspot.com",
  messagingSenderId: "131030770903",
  appId: "1:131030770903:web:eb760494e216e67855bc92"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Using real-time database

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

export { database, app };
