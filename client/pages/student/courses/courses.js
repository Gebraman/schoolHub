import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderStudentCourses() {
  const token = localStorage.getItem("token");
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/courses/courses.css");

  content.innerHTML = `<h2>Loading courses...</h2>`;

  try {
    const response = await fetch("http://localhost:3000/api/student/courses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const courses = await response.json();

    if (!courses.length) {
      content.innerHTML = `<h2>No courses available.</h2>`;
      return;
    }

    content.innerHTML = `
      <div class="student-courses">
        <h2>My Courses</h2>
        <div class="courses-grid">
          ${courses
            .map(
              (course) => `
              <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button class="view-course-btn" data-id="${course.id}">
                  View
                </button>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `;

    // Add click listeners
    document.querySelectorAll(".view-course-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const courseId = e.target.dataset.id;
        viewCourse(courseId);
      });
    });
  } catch (error) {
    console.error("Error loading courses:", error);
    content.innerHTML = `<h2>Error loading courses</h2>`;
  }
}

async function viewCourse(courseId) {
  const token = localStorage.getItem("token");
  const content = document.getElementById("studentContent");

  try {
    const response = await fetch(
      `http://localhost:3000/api/student/materials/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch materials");
    }

    const materials = await response.json();

    content.innerHTML = `
      <div class="course-materials">
        <h2>Course Materials</h2>

        <button id="backToCourses">⬅ Back</button>

        ${
          materials.length === 0
            ? "<p>No materials available.</p>"
            : materials
                //               .map(
                //                 (m) => `
                //   <div class="material-card">
                //     <h3>${m.title}</h3>

                //     <a href="http://localhost:3000/${m.file_path.replace(/\\\\/g, "/")}" target="_blank">
                //       📥 Download
                //     </a>
                //   </div>
                // `,
                //               )

                //               .join("")
                //       }
                //     </div>
                //   `;

                .map(
                  (m) => `
    <div class="material-card">
      <h3>${m.title}</h3>

      <div class="material-buttons">
        <a 
          href="http://localhost:3000/${m.file_path.replace(/\\\\/g, "/")}" 
          target="_blank"
          class="open-btn"
        >
          👁 Open
        </a>

        <a 
          href="http://localhost:3000/${m.file_path.replace(/\\\\/g, "/")}" 
          download
          class="download-btn"
        >
          📥 Download
        </a>
      </div>
    </div>
  `,
                )
                .join("")
        };
    </div>
    `;
    document
      .getElementById("backToCourses")
      .addEventListener("click", renderStudentCourses);
  } catch (error) {
    console.error("Error loading materials:", error);
    content.innerHTML = `<h2>Error loading materials</h2>`;
  }
}
