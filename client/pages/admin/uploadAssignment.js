import { loadCSS } from "../../utils/loadCSS.js";

export async function renderUploadAssignment() {
  const adminContent = document.getElementById("adminContent");

  // Load CSS
  await loadCSS("./pages/admin/uploadAssignment.css");

  // Load HTML
  const res = await fetch("./pages/admin/uploadAssignment.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // Load courses into dropdown
  await loadCourses();

  // Attach event
  document.getElementById("uploadAssignmentBtn").onclick = uploadAssignment;

  //  Smooth scroll into view
  setTimeout(() => {
    const card = document.querySelector(".assignment-card");
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
}

async function loadCourses() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const courses = await res.json();

    const select = document.getElementById("assignmentCourse");

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

async function uploadAssignment() {
  const courseId = document.getElementById("assignmentCourse").value;
  const title = document.getElementById("assignmentTitle").value.trim();
  const deadline = document.getElementById("deadline").value;
  const file = document.getElementById("assignmentFile").files[0];

  const token = localStorage.getItem("token");

  if (!courseId || !title || !deadline || !file) {
    alert("Please fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("title", title);
  formData.append("deadline", deadline);
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/api/assignments", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Upload failed");
      return;
    }

    alert("Assignment uploaded successfully");

    document.getElementById("assignmentCourse").value = "";
    document.getElementById("assignmentTitle").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("assignmentFile").value = "";
  } catch (err) {
    console.error("Upload error:", err);
    alert("Server error");
  }
}
