import { renderHome } from "./pages/home/home.js";
import { renderLogin } from "./pages/auth/login.js";
import { renderRegister } from "./pages/auth/register.js";
import { isAdminOrSuper } from "./utils/auth.js";
import { renderAdminDashboard } from "./pages/admin/dashboard.js";

// Navbar routing
document.getElementById("navHome").onclick = renderHome;
document.getElementById("navLogin").onclick = renderLogin;
document.getElementById("navRegister").onclick = renderRegister;
// to render the dashbored based on the user role, we will check if the user is admin or not and then render the dashboard accordingly

if (isAdminOrSuper()) {
  document.getElementById("navDashboard").style.display = "inline-block";
  document.getElementById("navDashboard").onclick = renderAdminDashboard;
}

// Default page
renderHome();
