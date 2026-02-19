import { renderHome } from "./pages/home/home.js";
import { renderLogin } from "./pages/auth/login.js";
import { renderRegister } from "./pages/auth/register.js";
import { renderAdminDashboard } from "./pages/admin/dashboard.js";
import { renderStudentLayout } from "./pages/student/layout/studentLayout.js";

// Navbar routing
document.getElementById("navHome").onclick = renderHome;
document.getElementById("navLogin").onclick = renderLogin;
document.getElementById("navRegister").onclick = renderRegister;

document.getElementById("navLogout").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateNavbar();
  renderHome();
};

// Mobile menu
const hamburger = document.getElementById("hamburger");
const navList = document.getElementById("navList");
const navItems = document.querySelectorAll("#navList li");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navList.classList.toggle("show");
  document.body.classList.toggle("menu-open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navList.classList.remove("show");
    document.body.classList.remove("menu-open");
  });
});

function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navLogin = document.getElementById("navLogin");
  const navRegister = document.getElementById("navRegister");
  const navDashboard = document.getElementById("navDashboard");
  const navLogout = document.getElementById("navLogout");

  // 🔥 Always clean mobile state
  document.body.classList.remove("menu-open");
  document.getElementById("app").style.marginLeft = "0";

  if (user) {
    navLogin.style.display = "none";
    navRegister.style.display = "none";
    navDashboard.style.display = "inline-block";
    navLogout.style.display = "inline-block";

    if (user.role === "admin") {
      navDashboard.onclick = renderAdminDashboard;
    } else if (user.role === "student") {
      navDashboard.onclick = renderStudentLayout;
    }
  } else {
    navLogin.style.display = "inline-block";
    navRegister.style.display = "inline-block";
    navDashboard.style.display = "none";
    navLogout.style.display = "none";
  }
}

updateNavbar();
renderHome();
