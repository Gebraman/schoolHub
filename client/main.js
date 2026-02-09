import { renderHome } from "./pages/home/home.js";
import { renderLogin } from "./pages/auth/login.js";
import { renderRegister } from "./pages/auth/register.js";
import { isAdminOrSuper } from "./utils/auth.js";
import { renderAdminDashboard } from "./pages/admin/dashboard.js";
// import { renderCourses } from "./pages/courses/courses.js";

// Navbar routing
document.getElementById("navHome").onclick = renderHome;
document.getElementById("navLogin").onclick = renderLogin;
document.getElementById("navRegister").onclick = renderRegister;
// to render the dashbored based on the user role, we will check if the user is admin or not and then render the dashboard accordingly
const navDashboard = document.getElementById("navDashboard");

if (isAdminOrSuper()) {
  navDashboard.style.display = "inline-block";
  navDashboard.onclick = renderAdminDashboard;
}
// if (!isAdminOrSuper()) {
//   alert("Access denied");
//   window.location.href = "/client/pages/login.html";
// }

// Default page
renderHome();
