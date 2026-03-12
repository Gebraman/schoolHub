import { loadCSS } from "../../utils/loadCSS.js";
import notifications from "../../utils/notifications.js";
import CONFIG from "../../config.js"; // Add this line

/**
 * Renders the schedule class page for admin
 * Loads CSS, fetches HTML, and sets up form
 */
export async function renderScheduleClass() {
  const adminContent = document.getElementById("adminContent");

  if (!adminContent) {
    console.error("adminContent not found");
    return;
  }

  await loadCSS("./pages/admin/scheduleClass.css");
  await loadCSS("../../utils/notifications.css");

  const res = await fetch("./pages/admin/scheduleClass.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  await loadCourses();

  // Auto-fill department from logged-in admin
  const user = JSON.parse(localStorage.getItem("user"));
  const deptField = document.getElementById("department");
  if (deptField && user?.department) {
    deptField.value = user.department;
  }

  document.getElementById("scheduleClassBtn").onclick = scheduleClass;

  setTimeout(() => {
    const card = document.querySelector(".schedule-card");
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
}

/**
 * Loads courses for the dropdown menu
 */
async function loadCourses() {
  const token = localStorage.getItem("token");

  try {
    // Fetch courses from backend API
    const res = await fetch(`${CONFIG.API_URL}/api/courses`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const courses = await res.json();

    const select = document.getElementById("scheduleCourse");

    select.innerHTML = '<option value="">Select Course</option>';

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.title;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Load courses error:", err);
  }
}

/**
 * Handles class scheduling form submission
 * Validates input and sends data to backend API
 */
async function scheduleClass() {
  const courseId = document.getElementById("scheduleCourse").value;
  const date = document.getElementById("classDate").value;
  const time = document.getElementById("classTime").value;
  const location = document.getElementById("classLocation").value.trim();
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const year = document.getElementById("year").value;

  const token = localStorage.getItem("token");

  // Validate all fields
  if (
    !courseId ||
    !date ||
    !time ||
    !location ||
    !department ||
    !section ||
    !year
  ) {
    notifications.warning("Please fill all fields", "Missing Information");
    return;
  }

  try {
    // Send schedule data to backend API
    const res = await fetch(`${CONFIG.API_URL}/api/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        course_id: courseId,
        class_date: date,
        class_time: time,
        location: location,
        department: department,
        section: section,
        year: year,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      notifications.error(data.message || "Schedule failed", "Error");
      return;
    }

    notifications.success(
      "Class scheduled successfully! Students will be notified 5 minutes before class.",
      "Success",
      5000,
    );

    // Clear form fields
    document.getElementById("scheduleCourse").value = "";
    document.getElementById("classDate").value = "";
    document.getElementById("classTime").value = "";
    document.getElementById("classLocation").value = "";
    // Department field stays auto-filled
    document.getElementById("section").value = "";
    document.getElementById("year").value = "";
  } catch (err) {
    console.error("Schedule error:", err);
    notifications.error("Server error. Please try again.", "Error");
  }
}
