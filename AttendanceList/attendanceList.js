// Importing Firebase database and required methods
import { database } from "../fireBaseConfig.js";
import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";


// Wait for the HTML document to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {

  const pages = document.querySelectorAll('.page');
  const buttons = document.querySelectorAll('.button');

  buttons.forEach(btn =>{
    btn.addEventListener('click', element =>{

      pages.forEach(page => {
          page.style.display = 'none'; // Hide all pages initially
      });

      buttons.forEach(button => {
        button.style.color = '#ffffff';
        button.style.background = '#2563EB';
      });

      const $element = element.target;
      $element.style.color = '#2563EB';
      $element.style.background = '#ffffff';

      if ($element.id == 'early') {
      document.querySelector('.early.page').style.display = 'block';
      console.log('early')
      } else if ($element.id == 'late') {
      document.querySelector('.late.page').style.display = 'block';
      } else if ($element.id == 'present') {
      document.querySelector('.present.page').style.display = 'block';
      } else if ($element.id == 'absent') {
      document.querySelector('.absent.page').style.display = 'block';
      } else {
        console.log('No page found for this button');
      }
  
    })
  })



  // Get references to the DOM elements that will display data
  const earlyContainer = document.querySelector(".early");
  const lateContainer = document.querySelector(".late");
  const presentContainer = document.querySelector(".present");
  const absentContainer = document.querySelector(".absent");
  const dateInput = document.getElementById("dateInput");
  const currentDate = document.getElementById("currentDate");
  
  // Format for displaying date in the UI
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };

  // When a user selects a date
  dateInput.addEventListener("change", async () => {
    const selectedDate = new Date(dateInput.value);
    // Format the selected date for display
    const displayDate = selectedDate.toLocaleDateString("en-GB", options).toUpperCase().replace(",", "");
    // Format the date for Firebase key (e.g. 2024-06-22)
    const firebaseDate = selectedDate.toISOString().split("T")[0];
    // Show the formatted date on the UI
    // currentDate.innerText = displayDate; ............
    // Load attendance data for the selected date
    await loadAttendance(firebaseDate);
  });
// Function to load and display attendance data
  async function loadAttendance(dateKey) {
    // Clear all containers before loading new data
    earlyContainer.innerHTML = "";
    lateContainer.innerHTML = "";
    presentContainer.innerHTML = "";
    absentContainer.innerHTML = "";

    const regRef = ref(database, "registeredWorker");
    const attendanceRef = ref(database, `attendance/${dateKey}`);

    console.log(attendanceRef)

    const regSnapshot = await get(regRef);
    let availableDates = [];

    // Collect all available date keys
    if (regSnapshot.exists()) {
          availableDates = Object.keys(regSnapshot.val());
    }
    
    console.log("Available Dates:", availableDates);

    const validDate = availableDates
      .filter(d => new Date(d) <= new Date(dateKey))
      .sort((a, b) => new Date(b) - new Date(a))[0];

    if (!validDate) {
      alert("No registered workers found for or before the selected date.");
      return;
    }

    const selectedRegWorkers = regSnapshot.val()[validDate] || {};
    const presentIds = new Set();

    console.log(selectedRegWorkers)

    const attSnapshot = await get(attendanceRef);
    const early = attSnapshot.child("early_comers").val() || {};
    const late = attSnapshot.child("late_comers").val() || {};

    Object.values(early).forEach(entry => {
      earlyContainer.innerHTML += `
            <ul class="attendanceDetails">
                <li class="staffName">${entry.name}</li>
                <li class="staffID">${entry.id}</li>
                <li class="time">${entry.time}</li>
            </ul>`
        ;
      presentIds.add(entry.id);
    });

    Object.values(late).forEach(entry => {
      lateContainer.innerHTML += `
            <ul class="attendanceDetails">
                <li class="staffName">${entry.name}</li>
                <li class="staffID">${entry.id}</li>
                <li class="time">${entry.time}</li>
            </ul>
      `;
      presentIds.add(entry.id);
    });

    presentContainer.innerHTML = earlyContainer.innerHTML + lateContainer.innerHTML;

    Object.values(selectedRegWorkers).forEach(worker => {
      if (!presentIds.has(worker.id)) {
        absentContainer.innerHTML +=         `
            <ul class="attendanceDetails">
                <li class="staffName">${worker.name}</li>
                <li class="staffID">${worker.id}</li>
                <li class="time">no time</li>
            </ul>
            `;
            // presentIds.add(entry.id);
      }
    });
  }
});
