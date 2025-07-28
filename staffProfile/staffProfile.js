// These details are stored on browser local storage from firebase
const nameEl = document.getElementById("StaffName");
const idEl = document.getElementById("staffId");
const dateEl = document.getElementById("dateRegistered");
const timeEl = document.getElementById("timeRegistered");

const name = localStorage.getItem("registeredName");
const id = localStorage.getItem("registeredId");
const timestamp = localStorage.getItem("registeredTimestamp");

if (name && id && timestamp) {
  // console.log("timestamp is:", timestamp); // ADD THIS
  
  const parts = timestamp.split(", ");

  console.log(parts)

  nameEl.innerHTML = name;
  idEl.innerHTML = id;
  dateEl.innerHTML = parts[0]
  timeEl.innerHTML = parts[1]
} else {
  nameEl.innerHTML = "No staff data found!";
}