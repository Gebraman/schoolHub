import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderStudentSchedule() {
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/schedule/studentSchedule.css");

  const res = await fetch("./pages/student/schedule/studentSchedule.html");
  content.innerHTML = await res.text();

  requestNotificationPermission(); // 🔔 ask permission
  loadSchedules();
}
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }
}
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
    schedules.forEach((s) => {
      startClassReminder(s);
    });

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

function startClassReminder(schedule) {
  const classDateTime = new Date(
    `${schedule.class_date}T${schedule.class_time}`,
  );
  const reminderTime = new Date(classDateTime.getTime() - 3 * 60 * 1000);

  let notified = false;

  setInterval(() => {
    const now = new Date();

    if (!notified && now >= reminderTime && now < classDateTime) {
      triggerNotification(schedule);
      triggerVibration();
      notified = true;
    }
  }, 60000);
}

function triggerNotification(schedule) {
  if (Notification.permission === "granted") {
    new Notification("📢 Class Reminder", {
      body: `25 minutes left for ${schedule.course_title} class`,
      icon: "/schoolHub/client/pages/assets/bell.png",
    });
  }
}
function triggerVibration() {
  if ("vibrate" in navigator) {
    navigator.vibrate([500, 200, 500]);
  }
}
