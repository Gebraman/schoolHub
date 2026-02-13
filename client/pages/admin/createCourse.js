import { loadCSS } from "../../utils/loadCSS.js";

export async function renderCreateCourse() {
  const adminContent = document.getElementById("adminContent");

  loadCSS("./pages/admin/createCourse.css");

  const res = await fetch("./pages/admin/createCourse.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  document.getElementById("createCourseBtn").onclick = createCourse;
}

async function createCourse() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;

  const token = localStorage.getItem("token");

  if (!title || !department || !section) {
    alert("Title, department and section are required");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title,
        description,
        department,
        section,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create course");
      return;
    }

    alert("Course created successfully");
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}
