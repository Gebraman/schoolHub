import { loadCSS } from "../../../utils/loadCSS.js";
import CONFIG from "../../../config.js";

/**
 * Renders the student assignments page
 * Fetches and displays all assignments for the student
 */
export async function renderStudentAssignments() {
  const token = localStorage.getItem("token");
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/assignments/assignment.css");

  content.innerHTML = `<div class="student-assignments"><h2>Loading assignments...</h2></div>`;

  try {
    // Load HTML template
    const rest = await fetch("./pages/student/assignments/assignment.html");
    content.innerHTML = await rest.text();

    // Fetch assignments from backend API
    const res = await fetch(`${CONFIG.API_URL}/api/student/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch assignments");

    const assignments = await res.json();

    const container = document.getElementById("assignmentContainer");

    if (!assignments.length) {
      container.innerHTML =
        "<p class='empty-message'>No assignments available yet.</p>";
      return;
    }

    // Render each assignment with file links
    container.innerHTML = assignments
      .map((a) => {
        const deadlineDate = new Date(a.deadline);
        const formattedDate = deadlineDate.toLocaleDateString();

        return `
          <div class="assignment-card">
            <div>
              <h3>${a.title}</h3>
              <p class="deadline">
                📅 Deadline: ${formattedDate}
              </p>
            </div>

            <div class="assignment-buttons">
              <a 
                href="${CONFIG.API_URL}/${a.file_path.replace(/\\\\/g, "/")}" 
                target="_blank"
                class="open-btn">
                👁 Open
              </a>

              <a 
                href="${CONFIG.API_URL}/${a.file_path.replace(/\\\\/g, "/")}" 
                download
                class="download-btn">
                📥 Download
              </a>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Student assignments error:", error);
    content.innerHTML = `
      <div class="student-assignments">
        <h2>Error loading assignments</h2>
      </div>
    `;
  }
}
