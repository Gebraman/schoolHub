import { loadCSS } from "../../utils/loadCSS.js";
import { renderAdminCourseDetails } from "./adminCourseDetails.js";
import CONFIG from "../../config.js"; // Add this line

/**
 * Renders the admin courses page
 * Loads CSS, fetches HTML, and loads course list
 */
export async function renderAdminCourses() {
  const content = document.getElementById("adminContent");

  await loadCSS("./pages/admin/adminCourses.css");

  const res = await fetch("./pages/admin/adminCourses.html");
  content.innerHTML = await res.text();

  loadAdminCourses();
}

/**
 * Fetches and displays all courses for admin
 */
async function loadAdminCourses() {
  const token = localStorage.getItem("token");

  try {
    // Fetch courses from backend API
    const res = await fetch(`${CONFIG.API_URL}/api/courses`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const courses = await res.json();

    const container = document.getElementById("adminCourseList");

    if (!courses.length) {
      container.innerHTML = "<p>No courses found in your department.</p>";
      return;
    }

    // Render course cards
    container.innerHTML = courses
      .map(
        (c) => `
        <div class="course-card" onclick="viewCourse(${c.id})">
          <h3>${c.title}</h3>
          <p>Year: ${c.year}</p>
          <p>Section: ${c.section}</p>
        </div>
      `,
      )
      .join("");

    // Attach view function to window for onclick handler
    window.viewCourse = function (courseId) {
      renderAdminCourseDetails(courseId);
    };
  } catch (error) {
    console.error("Admin courses error:", error);
  }
}
