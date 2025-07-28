import { database } from '../fireBaseConfig.js';
import { ref, onValue, get, child } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

const presentSpan = document.getElementById('nOfPresentStaff');
const absentSpan = document.getElementById('nOfAbsentStaff');
const totalSpan = document.getElementById('totalStaffCount');
// const dateHeader = document.getElementById('currentDate');

// 👇 Human-readable date for UI
const today = new Date();
const uiOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const formattedUI = today.toLocaleDateString('en-GB', uiOptions).toUpperCase().replace(',', '');
// console.log("Formatted UI Date:", formattedUI);
// dateHeader.textContent = formattedUI;

// 👇 Date format for Firebase: "YYYY-MM-DD"
const firebaseDateKey = today.toISOString().split('T')[0];

// 👥 Get today's registered workers
const dbRef = ref(database); // reference to the database root

// ➡️ Move currentTotal declaration UP
let currentTotal = 0;
let presentCount = 0;
let presentIds = new Set();

//  get registered workers from Firebase
get(child(dbRef, `registeredWorker`)).then(snapshot => {
  // Since we store registered workers by date, we need to find the latest date as it changes when new workers are registered
  if (snapshot.exists()) {
    const allDates = Object.keys(snapshot.val()); // get all dates from registeredWorker
    const latestDate = allDates.sort().pop(); // Get the last date alphabetically (latest)
    const latestWorkersRef = ref(database, `registeredWorker/${latestDate}`); // Reference to the latest date's workers
    onValue(latestWorkersRef, snap => {
      let registeredWorkers = {};
      snap.forEach(childSnap => {
        const staff = childSnap.val();
        console.log('staff:', staff);
        registeredWorkers[staff.id] = staff; // We're changing this to use staff.id as the key

        console.log('registeredWorkers[staff.id]:', registeredWorkers[staff.id]);
        console.log('staffkey', registeredWorkers.key)
      });

      currentTotal = Object.keys(registeredWorkers).length;
      totalSpan.textContent = currentTotal;

      updateAbsent();

      loadAttendance(registeredWorkers);
    });
  }
});

// 📅 Get today's present staff
const attendanceRef = ref(database, `attendance/${firebaseDateKey}`);

onValue(attendanceRef, snapshot => {
  presentIds.clear();
  if (snapshot.exists()) {
    const data = snapshot.val();
    const early = data.early_comers || {};
    const late = data.late_comers || {};

    Object.values(early).forEach(entry => presentIds.add(entry.id));
    Object.values(late).forEach(entry => presentIds.add(entry.id));
  }

  presentCount = presentIds.size;
  presentSpan.textContent = `${presentCount}`;

  updateAbsent();
});

// 🔄 Update absent staff count
function updateAbsent() {
  const absentCount = currentTotal - presentCount;
  absentSpan.textContent = absentCount >= 0 ? absentCount : 0;
}

// 📤 Load attendance data for early and late attendees
function loadAttendance(registeredWorkers) {
  const earlyContainer = document.getElementById("earlyCase");
  const lateContainer = document.getElementById("lateCase");
  const presentContainer = document.getElementById("presentCase");
  const absentContainer = document.getElementById("absentCase");

  earlyContainer.innerHTML = " ";
  lateContainer.innerHTML = " ";
  presentContainer.innerHTML = " ";
  absentContainer.innerHTML = " ";

  const attRef = ref(database, `attendance/${firebaseDateKey}`);

  onValue(attRef, snap => {
    const data = snap.val() || {};
    const early = data.early_comers || {};
    const late = data.late_comers || {};

    Object.values(early).forEach(entry => {
      earlyContainer.innerHTML += `
        <div class="tableRow">
          <p>${entry.name}</p>
          <p>${entry.id}</p>
          <p>${entry.time}</p>
        </div>
      `;
    });

    Object.values(late).forEach(entry => {
      lateContainer.innerHTML += `
        <div class="tableRow">
          <p>${entry.name}</p>
          <p>${entry.id}</p>
          <p>${entry.time}</p>
        </div>
      `;
    });

    presentContainer.innerHTML = earlyContainer.innerHTML + lateContainer.innerHTML;

    // Show absent workers
    Object.keys(registeredWorkers).forEach(id => {
      if (!presentIds.has(id)) {
        absentContainer.innerHTML += `
          <div class="tableRow">
            <p>${registeredWorkers[id].name}</p>
            <p>${registeredWorkers[id].id}</p>
            <p>--</p>
          </div>
        `;
      }
    });
  });
}


const buttons = document.getElementById('buttons');

buttons.addEventListener('click', event => {
  const target = event.target;
  if(target.id === 'attendanceList') {
    window.location.href = '../AttendanceList/attendanceList.html';
  } else if(target.id === 'addStaff') {
    window.location.href = '../addStaffNewStaff/registration.html';
  } else if(target.id === 'registeredStaff') {
    window.location.href = '../registeredWorkers/registeredWorkers.html';
  }
})