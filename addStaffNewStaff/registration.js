import { database } from "../fireBaseConfig.js";
import {
  ref,
  get,
  set,
  push,
  child,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const actionBtn = document.getElementById("doneBtn");
  const staffIdInput = document.getElementById("staffId");
  const staffName = document.getElementById("staffName");
  const spinner = document.getElementById("spinner");

  let hasGenerated = false;

  actionBtn.addEventListener("click", async () => {
    const name = staffName.value.trim();
    if (name === "") {
      alert("Please enter your name.");
      return;
    }

    const now = new Date();
    const lagosNow = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
    const today = lagosNow.toISOString().split("T")[0];
    const timestamp = lagosNow.toLocaleString();

    const allWorkersRef = ref(database, "registeredWorker");

    // Check if name already exists anywhere
    const allSnapshot = await get(allWorkersRef);
    let nameExists = false;
    let latestDate = "";

    if (allSnapshot.exists()) {
      const allData = allSnapshot.val();
      const allDates = Object.keys(allData).sort();
      latestDate = allDates[allDates.length - 1];

      for (const date in allData) {
        const workers = Object.values(allData[date]);
        if (workers.find(w => w.name.toLowerCase() === name.toLowerCase())) {
          nameExists = true;
          break;
        }
      }
    }

    if (!hasGenerated) {
      if (nameExists) {
        alert("This name has already been registered.");
        return;
      }

      // Show spinner while generating ID
      spinner.style.display = "inline-block";
      actionBtn.textContent = "Generating ID...";
      actionBtn.disabled = true;

      setTimeout(() => {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        staffIdInput.value = randomId;
        actionBtn.textContent = "Register Worker";
        actionBtn.disabled = false;
        spinner.style.display = "inline-block";
        hasGenerated = true;
      }, 3000);
    } else {
      const id = staffIdInput.value.trim();
      if (!id) {
        alert("Please generate an ID first.");
        return;
      }

      const todayRef = ref(database, `registeredWorker/${today}`);
      const todaySnapshot = await get(todayRef);
      const alreadyToday = todaySnapshot.exists()
        ? Object.values(todaySnapshot.val()).find(w => w.name.toLowerCase() === name.toLowerCase())
        : false;

      if (alreadyToday) {
        alert("This name has already been registered today.");
        return;
      }

      // If today's path doesn't exist, clone the latest date's list (if any)
      if (!todaySnapshot.exists() && latestDate && latestDate !== today) {
        const latestRef = ref(database, `registeredWorker/${latestDate}`);
        const latestSnapshot = await get(latestRef);

        if (latestSnapshot.exists()) {
          const clonedWorkers = latestSnapshot.val();
          for (const key in clonedWorkers) {
            await push(todayRef, clonedWorkers[key]);
          }
        }
      }

      // Add new worker under today
      await push(todayRef, {
        name,
        id,
        registeredTime: timestamp
      });

      alert("Worker registered successfully!");
      localStorage.setItem("registeredName", name);
      localStorage.setItem("registeredId", id);
      localStorage.setItem("registeredTimestamp", timestamp);
      window.location.href = "../staffProfile/staffProfile.html";
    }
  });
});