import { loadCSS } from "../../utils/loadCSS.js";

export async function renderUploadMaterial() {
  const adminContent = document.getElementById("adminContent");

  // Load CSS
  await loadCSS("./pages/admin/uploadMaterial.css");

  // Load HTML
  const res = await fetch("./pages/admin/uploadMaterial.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // Scroll into view smoothly after loading
  const uploadContainer = document.querySelector(".upload-container");
  if (uploadContainer) {
    setTimeout(() => {
      uploadContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100); // small delay for fade-in effect
  }

  // Fetch courses for dropdown
  await loadCourses();

  // Attach event after HTML is loaded
  document.getElementById("uploadMaterialBtn").onclick = uploadMaterial;
}

async function uploadMaterial() {
  const courseId = document.getElementById("materialCourse").value;
  const title = document.getElementById("materialTitle").value;
  const file = document.getElementById("materialFile").files[0];

  const token = localStorage.getItem("token");

  if (!courseId || !title || !file) {
    alert("Please select course, title and file");
    return;
  }

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("title", title);
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/api/materials", {
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

    alert("✅ Material uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
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

    const select = document.getElementById("materialCourse");

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
