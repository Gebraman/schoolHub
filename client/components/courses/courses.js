console.log(courses);

async function renderCourses() {
  const app = document.getElementById("app");
  app.innerHTML = "<p>Loading courses...</p>";

  try {
    const res = await fetch("http://localhost:3000/api/courses");
    const courses = await res.json();

    if (!Array.isArray(courses) || courses.length === 0) {
      app.innerHTML = "<p>No courses available.</p>";
      return;
    }

    app.innerHTML = `
      <div class="courses-list">
        ${courses
          .map(
            (c) => `
          <div class="course-item">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            <button data-id="${c.id}" class="view-course">View</button>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    document.querySelectorAll(".view-course").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        renderCourseDetail(id);
      });
    });
  } catch (err) {
    console.error(err);
    app.innerHTML = "<p>Failed to load courses.</p>";
  }
}

async function renderCourseDetail(courseId) {
  const app = document.getElementById("app");
  const token = localStorage.getItem("token");

  app.innerHTML = "<p>Loading course...</p>";

  const res = await fetch(`http://localhost:3000/api/courses/${courseId}`);
  const course = await res.json();

  app.innerHTML = `
    <div class="course-detail">
      <h2>${course.title}</h2>
      <p>${course.description}</p>

      <button id="enrollNow">Enroll in this course</button>
    </div>
  `;

  document.getElementById("enrollNow").addEventListener("click", async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    await fetch(`http://localhost:3000/api/enrollments/${courseId}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });

    alert("Enrolled successfully");
    show(renderDashboard);
  });
}
