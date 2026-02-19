import { loadCSS } from "../../../utils/loadCSS.js";
import { renderStudentDashboard } from "../dashboard/dashboard.js";
import { renderStudentCourses } from "../courses/courses.js";

export async function renderStudentLayout() {
  const app = document.getElementById("app");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔐 Security Check
  if (!token || !user || user.role !== "student") {
    alert("Unauthorized access");
    return;
  }

  await loadCSS("./pages/student/layout/studentLayout.css");

  const res = await fetch("./pages/student/layout/studentLayout.html");
  app.innerHTML = await res.text();

  // Load default page
  renderStudentDashboard();

  // Navigation
  document.getElementById("studentNavDashboard").onclick =
    renderStudentDashboard;

  document.getElementById("studentNavCourses").onclick = renderStudentCourses;

  document.getElementById("studentNavAssignments").onclick = () => {
    alert("Assignments page coming next");
  };

  document.getElementById("studentNavSchedule").onclick = () => {
    alert("Schedule page coming next");
  };

  document.getElementById("studentNavLogout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  };
}
