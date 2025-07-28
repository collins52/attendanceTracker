import { database } from "../fireBaseConfig.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("registeredWorkers");
  const searchInput = document.getElementById("searchInput");
  const workersRef = ref(database, "registeredWorker");

  let allWorkers = [];

  const snapshot = await get(workersRef);
  
  container.innerHTML = "";

  let latestDate = "";
  snapshot.forEach(child => {
    const key = child.key;
    // console.log("key:", key);
    if (!latestDate || new Date(key) > new Date(latestDate)) {
      latestDate = key;
      console.log('new Date(key)',new Date(key), 'new Date(latestDate)', new Date(latestDate));
    }
  });

  const latestWorkersData = snapshot.child(latestDate).val();

  if (latestWorkersData) {
    allWorkers = Object.values(latestWorkersData);
    allWorkers.forEach(displayWorker);
  }
  
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    container.innerHTML = "";

    const filtered = allWorkers.filter(w =>
      w.name.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
      container.innerHTML = "<p>No match found</p>";
    } else {
      filtered.forEach(displayWorker);
    }
  });

  function displayWorker(worker) {
    const workerDiv = document.createElement("div");
    workerDiv.classList.add("worker");
    workerDiv.id = 'user'
    workerDiv.innerHTML = `
        <div>
          <img src="../svgs/account_circle.svg" alt="">
          <p>${worker.name}</p>
        </div>
        <a href="../staffProfile/staffProfile.html"><button id="showProfile">Profile</button></a>
        `;

    const button = workerDiv.querySelector("#showProfile");
    button.addEventListener("click", () => {
    localStorage.setItem("registeredName", worker.name);
    localStorage.setItem("registeredId", worker.id);
    localStorage.setItem("registeredTimestamp", worker.registeredTime);
});

    container.appendChild(workerDiv);
  }
});
