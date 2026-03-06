import { renderCreateCourse } from "./createCourse.js";
import { renderUploadMaterial } from "./uploadMaterial.js";
import { renderUploadAssignment } from "./uploadAssignment.js";
import { renderScheduleClass } from "./scheduleClass.js";
import { renderAdminCourses } from "./adminCourses.js";
import { loadCSS } from "../../utils/loadCSS.js";

export async function renderAdminDashboard() {
  const app = document.getElementById("app");

  await loadCSS("./pages/admin/dashboard.css");

  const res = await fetch("./pages/admin/dashboard.html");
  app.innerHTML = await res.text();

  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("adminName").textContent = user.firstName;
  document.getElementById("adminRole").textContent = user.role;
  document.getElementById("adminDepartment").textContent = user.department;
  document.getElementById("adminSection").textContent = user.section;
  document.getElementById("adminYear").textContent = user.year;

  // ================= DASHBOARD BUTTONS =================
  document.getElementById("openCreateCourseBtn").onclick = renderCreateCourse;
  document.getElementById("openMaterialBtn").onclick = renderUploadMaterial;
  document.getElementById("openAssignmentBtn").onclick = renderUploadAssignment;
  document.getElementById("openScheduleClassBtn").onclick = renderScheduleClass;
  document.getElementById("openAdminCoursesBtn").onclick = renderAdminCourses;

  // ================= SIDEBAR TOGGLE =================
  const sidebar = document.getElementById("adminSidebar");
  const openBtn = document.getElementById("openSidebarBtn");
  const closeBtn = document.getElementById("closeSidebarBtn");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  // ================= ACTIVE MENU HIGHLIGHT =================
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((btn) => {
    btn.addEventListener("click", function () {
      menuItems.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");

      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
      }
    });
  });

  // ================= PROFILE IMAGE LOGIC =================
  const profileInput = document.getElementById("profileInput");
  const adminAvatar = document.getElementById("adminAvatar");

  const savedImage = localStorage.getItem("adminProfileImage");
  if (savedImage) {
    adminAvatar.src = savedImage;
  }

  adminAvatar.addEventListener("click", () => {
    profileInput.click();
  });

  profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      adminAvatar.src = e.target.result;
      localStorage.setItem("adminProfileImage", e.target.result);
    };
    reader.readAsDataURL(file);
  });
  //default
  renderCreateCourse();
}
