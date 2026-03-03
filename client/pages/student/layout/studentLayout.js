import { loadCSS } from "../../../utils/loadCSS.js";
import { renderStudentDashboard } from "../dashboard/dashboard.js";
import { renderStudentCourses } from "../courses/courses.js";
import { renderStudentAssignments } from "../assignments/assignment.js";
import { renderStudentSchedule } from "../schedule/studentSchedule.js";

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
  document.getElementById("studentNavAssignments").onclick =
    renderStudentAssignments;

  document.getElementById("studentNavSchedule").onclick = renderStudentSchedule;

  document.getElementById("studentNavLogout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  };

  // ===== ACTIVE MENU HIGHLIGHT =====
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });
  document.getElementById("studentName").textContent = user.firstName;

  const avatar = document.getElementById("studentAvatar");
  const savedImage = localStorage.getItem("studentProfileImage");

  if (savedImage) {
    avatar.src = savedImage;
  }

  avatar.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        avatar.src = event.target.result;
        localStorage.setItem("studentProfileImage", event.target.result);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  });

  // ===== MOBILE SIDEBAR TOGGLE =====
  // ===== MOBILE SIDEBAR TOGGLE =====
  const sidebar = document.getElementById("studentSidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("closeSidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // Close sidebar when clicking menu (mobile)
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
      }
    });
  });
}
