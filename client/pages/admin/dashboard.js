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
  document.getElementById("createCourseBtn").onclick = renderCreateCourse;

  // New button for Upload Material
  document.getElementById("uploadMaterialBtn").onclick = renderUploadMaterial;
  // New button for Upload Assignment
  document.getElementById("uploadAssignmentBtn").onclick =
    renderUploadAssignment;
  // New button for Schedule Class
  document.getElementById("scheduleClassBtn").onclick = renderScheduleClass;
}
