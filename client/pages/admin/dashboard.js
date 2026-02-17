import { renderCreateCourse } from "./createCourse.js";
import { renderUploadMaterial } from "./uploadMaterial.js";
import { renderUploadAssignment } from "./uploadAssignment.js";
import { renderScheduleClass } from "./scheduleClass.js";
import { loadCSS } from "../../utils/loadCSS.js";

export async function renderAdminDashboard() {
  const app = document.getElementById("app");

  await loadCSS("./pages/admin/dashboard.css");

  const res = await fetch("./pages/admin/dashboard.html");
  app.innerHTML = await res.text();

  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("adminName").textContent = user.firstName;
  document.getElementById("adminRole").textContent = user.role;
  document.getElementById("adminDepartment").textContent =
    user.role === "super_admin" ? "All Departments" : user.department;
  document.getElementById("adminSection").textContent =
    user.role === "super_admin" ? "All Sections" : user.section;

  // Dashboard action buttons
  document.getElementById("openCreateCourseBtn").onclick = renderCreateCourse;
  document.getElementById("openMaterialBtn").onclick = renderUploadMaterial;
  document.getElementById("uploadAssignmentBtn").onclick =
    renderUploadAssignment;
  document.getElementById("scheduleClassBtn").onclick = renderScheduleClass;

  /* ==============================
     PROFILE IMAGE PREVIEW LOGIC
     ============================== */

  const profileInput = document.getElementById("profileInput");
  const adminAvatar = document.getElementById("adminAvatar");

  // Load saved image from localStorage
  const savedImage = localStorage.getItem("adminProfileImage");
  if (savedImage) {
    adminAvatar.src = savedImage;
  }

  // Click image → open file picker
  adminAvatar.addEventListener("click", () => {
    profileInput.click();
  });

  // Preview and save image
  profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      adminAvatar.src = e.target.result;

      // Save to localStorage
      localStorage.setItem("adminProfileImage", e.target.result);
    };
    reader.readAsDataURL(file);
  });
}
