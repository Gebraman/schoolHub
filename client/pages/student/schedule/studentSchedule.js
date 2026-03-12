import { loadCSS } from "../../../utils/loadCSS.js";
import CONFIG from "../../../config.js";

/**
 * Renders the student schedule page
 * Loads CSS, fetches HTML, and loads schedule data
 */
export async function renderStudentSchedule() {
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/schedule/studentSchedule.css");

  const res = await fetch("./pages/student/schedule/studentSchedule.html");
  content.innerHTML = await res.text();

  loadSchedules();
}

/**
 * Fetches and displays the student's class schedule
 * Retrieves schedule data from the backend API
 */
async function loadSchedules() {
  const token = localStorage.getItem("token");

  try {
    // Fetch schedule data from backend API
    const res = await fetch(`${CONFIG.API_URL}/api/schedule`, {
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

    // Render each schedule item
    container.innerHTML = schedules
      .map((s) => {
        const formattedDate = new Date(s.class_date).toLocaleDateString();

        return `
          <div class="schedule-item">
            <h3>📅 ${formattedDate}</h3>
            <p><strong>📚 Course:</strong> ${s.course_title}</p>
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
