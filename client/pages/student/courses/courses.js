import { loadCSS } from "../../../utils/loadCSS.js";
export async function renderStudentCourses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const content = document.getElementById("studentContent");
  await loadCSS("./pages/student/courses/courses.css");

  content.innerHTML = `<h2>Loading courses...</h2>`;

  try {
    const response = await fetch("http://localhost:3000/api/student/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const courses = await response.json();

    // 🔥 Filter based on student info
    const filteredCourses = courses.filter(
      (course) =>
        course.department === user.department &&
        course.section === user.section &&
        course.year === user.year,
    );

    if (filteredCourses.length === 0) {
      content.innerHTML = `<h2>No courses available.</h2>`;
      return;
    }

    content.innerHTML = `
      <div class="student-courses">
        <h2>My Courses</h2>
        <div class="courses-grid">
          ${filteredCourses
            .map(
              (course) => `
              <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button class="view-course-btn" data-id="${course._id}">
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
      btn.addEventListener("click", () => {
        const courseId = btn.dataset.id;
        alert("Open course ID: " + courseId);
        // Later we build course details page
      });
    });
  } catch (error) {
    content.innerHTML = `<h2>Error loading courses</h2>`;
  }
}
