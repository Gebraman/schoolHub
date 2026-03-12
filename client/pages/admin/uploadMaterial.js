import { loadCSS } from "../../utils/loadCSS.js";
import notifications from "../../utils/notifications.js";
import CONFIG from "../../config.js"; // Add this line

/**
 * Renders the upload material page for admin
 * Loads CSS, fetches HTML, and sets up form
 */
export async function renderUploadMaterial() {
  const adminContent = document.getElementById("adminContent");

  // Load CSS
  await loadCSS("./pages/admin/uploadMaterial.css");
  await loadCSS("../../utils/notifications.css");

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

/**
 * Handles material upload form submission
 * Validates input and sends data to backend API
 */
async function uploadMaterial() {
  const courseId = document.getElementById("materialCourse").value;
  const title = document.getElementById("materialTitle").value;
  const file = document.getElementById("materialFile").files[0];

  const token = localStorage.getItem("token");

  if (!courseId || !title || !file) {
    notifications.warning(
      "Please select course, title and file",
      "Missing Information",
    );
    return;
  }

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("title", title);
  formData.append("file", file);

  try {
    // Send material data to backend API
    const res = await fetch(`${CONFIG.API_URL}/api/materials`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      notifications.error(data.message || "Upload failed", "Error");
      return;
    }

    notifications.success("Material uploaded successfully", "Success");

    // Clear form fields
    document.getElementById("materialCourse").value = "";
    document.getElementById("materialTitle").value = "";
    document.getElementById("materialFile").value = "";
  } catch (err) {
    console.error("Upload material error:", err);
    notifications.error("Server error. Please try again.", "Error");
  }
}

/**
 * Loads courses for the dropdown menu
 */
async function loadCourses() {
  const token = localStorage.getItem("token");

  try {
    // Fetch courses from backend API
    const res = await fetch(`${CONFIG.API_URL}/api/courses`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const courses = await res.json();

    const select = document.getElementById("materialCourse");
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
