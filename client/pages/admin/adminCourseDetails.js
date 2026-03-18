import { renderAdminCourses } from "./adminCourses.js";
import { loadCSS } from "../../utils/loadCSS.js";
import CONFIG from "../../config.js"; // Add this line

/**
 * Renders detailed view of a specific course for admin
 * Displays course info, materials, and assignments
 * @param {string} courseId - ID of the course to view
 */
export async function renderAdminCourseDetails(courseId) {
  const content = document.getElementById("adminContent");
  await loadCSS("./pages/admin/adminCourseDetails.css");
  const token = localStorage.getItem("token");

  // Fetch course details from backend API
  const res = await fetch(`${CONFIG.API_URL}/api/courses/${courseId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const data = await res.json();

  content.innerHTML = `
  <section class="course-details">

    <div class="top-bar">
      <button id="backToCourses" class="back-btn">← Back</button>
      <h2>${data.course.title}</h2>
    </div>

    <div class="course-info">
      <p><strong>Description:</strong> ${data.course.description}</p>
      <p><strong>Year:</strong> ${data.course.year}</p>
      <p><strong>Section:</strong> ${data.course.section}</p>
      <p><strong>Department:</strong> ${data.course.department}</p>
    </div>




    
    <div class="content-section">
      <h3>Materials</h3>
      <div class="card-grid">
        ${
          data.materials.length
            ? data.materials
                .map(
                  (m) => `
                <div class="file-card">
                  <p>${m.title}</p>
                  <div class="file-actions">
                    <a href="${CONFIG.API_URL}/${m.file_path}" target="_blank">
                      <button class="action-btn">Open</button>
                    </a>
                    <a href="${CONFIG.API_URL}/${m.file_path}" download>
                      <button class="action-btn download">Download</button>
                    </a>
                  </div>
                </div>
              `,
                )
                .join("")
            : "<p class='empty'>No materials</p>"
        }
      </div>
    </div>

    <div class="content-section">
      <h3>Assignments</h3>
      <div class="card-grid">
        ${
          data.assignments.length
            ? data.assignments
                .map(
                  (a) => `
                <div class="file-card">
                  <p>${a.title}</p>
                  <div class="file-actions">
                    <a href="${CONFIG.API_URL}/${a.file_path}" target="_blank">
                      <button class="action-btn">Open</button>
                    </a>
                    <a href="${CONFIG.API_URL}/${a.file_path}" download>
                      <button class="action-btn download">Download</button>
                    </a>
                  </div>
                </div>
              `,
                )
                .join("")
            : "<p class='empty'>No assignments</p>"
        }
      </div>
    </div>

  </section>
`;

  // Attach back button event
  document.getElementById("backToCourses").addEventListener("click", () => {
    renderAdminCourses();
  });
}
