import { database } from "../fireBaseConfig.js";
import { ref, get, set, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// console.log('javascipt is connected')
document.addEventListener("DOMContentLoaded", () => {
  const doneBtn = document.getElementById("doneBtn");
  const staffName = document.getElementById("staffName");
  const staffId = document.getElementById("staffId");
  const spinner = document.querySelector(".spinner");

  doneBtn.addEventListener("click", async () => {
    console.log('utton is working')
    const name = staffName.value.trim();
    const id = staffId.value.trim();

    if (!name || !id) {
      alert("Please enter both name and ID.");
      return;
    }
    // spinner
    spinner.style.display = "inline";

    try {
      const registeredWorkersRef = ref(database, "registeredWorker");
      const snapshot = await get(registeredWorkersRef);

      let isRegistered = false;
      let registeredId = null;

      snapshot.forEach(dateSnap => {
        dateSnap.forEach(workerSnap => {
          const worker = workerSnap.val();
          if (worker.name === name) {
            isRegistered = true;
            registeredId = worker.id;
          }
        });
      });

      if (!isRegistered) {
        alert("The name you entered is not a registered worker.");
        return;
      }

      if (id !== registeredId) {
        alert("The ID entered does not match the registered ID for this worker.");
        return;
      }

      const now = new Date();
      const lagosNow = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
      const dateString = lagosNow.toISOString().split("T")[0];

      const earlyCutoff = new Date(lagosNow);
      earlyCutoff.setHours(8, 0, 0, 0); // 08:00:00.000

      const isLate = lagosNow >= earlyCutoff;
      const status = isLate ? "late_comers" : "early_comers";

      const attendanceRef = ref(database, `attendance/${dateString}/${status}`);
      const attendanceSnapshot = await get(attendanceRef);

      let alreadyMarked = false;
      attendanceSnapshot.forEach(child => {
        if (child.val().name === name) {
          alreadyMarked = true;
        }
      });

      if (alreadyMarked) {
        alert(`${name} is already marked as ${status.replace("_", " ")} for today.`);
      } else {
        const attendanceData = {
          name,
          id,
          time: lagosNow.toLocaleTimeString(),
        };

        const newRef = push(attendanceRef);
        await set(newRef, attendanceData);

        alert(`${name} marked as ${status.replace("_", " ")} for today.`);
      }

    } catch (error) {
      console.error("Error marking attendance:", error.message);
      alert("An error occurred while marking attendance.");
    } finally {
      spinner.style.display = "none";
      staffName.value = "";
      staffId.value = "";
    }
  });
});
