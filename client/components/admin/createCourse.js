function renderCreateCourse() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="admin-course">
      <h2>Create New Course</h2>
      <p>Add a course for students</p>

      <form id="createCourseForm">
        <input type="text" id="title" placeholder="Course title" required />
        <textarea id="description" placeholder="Course description"></textarea>

        <button type="submit">Create Course</button>
      </form>
    </section>
  `;

  document
    .getElementById("createCourseForm")
    .addEventListener("submit", handleCreateCourse);
}
async function handleCreateCourse(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed");
      return;
    }

    alert("Course created successfully");
    show(renderCourses);
  } catch (err) {
    alert("Server error");
  }
}
