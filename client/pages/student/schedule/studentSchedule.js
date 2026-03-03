import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderStudentSchedule() {
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/schedule/studentSchedule.css");

  const res = await fetch("./pages/student/schedule/studentSchedule.html");
  content.innerHTML = await res.text();

  loadSchedules();
}

// async function loadSchedules() {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch("http://localhost:3000/api/schedule", {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });

//     const schedules = await res.json();

//     const container = document.getElementById("scheduleList");

//     if (!schedules.length) {
//       container.innerHTML = "<p>No scheduled classes yet.</p>";
//       return;
//     }

//     container.innerHTML = schedules
//       .map(
//         (s) => `
//         <div class="schedule-item">
//           <h3>${s.class_date}</h3>
//           <p><strong>Time:</strong> ${s.class_time}</p>
//           <p><strong>Location:</strong> ${s.location}</p>
//         </div>
//       `,
//       )
//       .join("");
//   } catch (err) {
//     console.error("Student schedule error:", err);
//   }
// }
async function loadSchedules() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/schedule", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch schedules");

    const schedules = await res.json();
    const container = document.getElementById("scheduleList");

    if (!schedules.length) {
      container.innerHTML =
        "<p class='empty-message'>No scheduled classes yet.</p>";
      return;
    }

    container.innerHTML = schedules
      .map((s) => {
        const formattedDate = new Date(s.class_date).toLocaleDateString();

        return `
          <div class="schedule-item">
            <h3>📅 ${formattedDate}</h3>
            <p><strong>⏰ Time:</strong> ${s.class_time}</p>
            <p><strong>📍 Location:</strong> ${s.location}</p>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Student schedule error:", err);
  }
}
