import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderStudentDashboard() {
  const content = document.getElementById("studentContent");

  await loadCSS("./pages/student/dashboard/dashboard.css");

  const res = await fetch("./pages/student/dashboard/dashboard.html");
  content.innerHTML = await res.text();

  const user = JSON.parse(localStorage.getItem("user"));

  // Fill user info
  document.getElementById("studentName").textContent = user.firstName;
  document.getElementById("studentRole").textContent = user.role;
  document.getElementById("studentDepartment").textContent = user.department;
  document.getElementById("studentSection").textContent = user.section;
  document.getElementById("studentYear").textContent = user.year;

  // Temporary static counts (we connect API later)
  document.getElementById("courseCount").textContent = "-";
  document.getElementById("assignmentCount").textContent = "-";
  document.getElementById("scheduleCount").textContent = "-";
}
