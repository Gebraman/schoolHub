import { loadCSS } from "../../utils/loadCSS.js";
import notifications from "../../utils/notifications.js";

export async function renderCreateCourse() {
  const adminContent = document.getElementById("adminContent");

  await loadCSS("./pages/admin/createCourse.css");
  await loadCSS("../../utils/notifications.css");
  const res = await fetch("./pages/admin/createCourse.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // Scroll the new content into view
  const courseContainer = document.querySelector(".course-container");
  if (courseContainer) {
    // Slight delay so CSS animations run
    setTimeout(() => {
      courseContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100); // 100ms delay
  }

  document.getElementById("createCourseBtn").onclick = createCourse;
}

async function createCourse() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const year = document.getElementById("year").value;

  const token = localStorage.getItem("token");

  if (!title || !department || !section || !year) {
    notifications.warning(
      "Please fill in all required fields",
      "Missing Information",
    );
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
        year,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      notifications.error(data.message || "Failed to create course", "Error");
      return;
    }

    notifications.success("Course created successfully", "Success");

    // Clear form
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("department").value = "";
    document.getElementById("section").value = "";
    document.getElementById("year").value = "";
  } catch (err) {
    console.error(err);
    notifications.error("Server error. Please try again.", "Error");
  }
}
