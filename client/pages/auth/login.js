import { loadCSS } from "../../utils/loadCSS.js";
import { renderRegister } from "./register.js";
import { renderAdminDashboard } from "../admin/dashboard.js";
import { renderStudentLayout } from "../student/layout/studentLayout.js";
import notifications from "../../utils/notifications.js";
// Import API configuration for environment-specific URLs
import CONFIG from "../../config.js";

/**
 * Renders the login page
 * Loads CSS, fetches HTML, and attaches event listeners
 */
export async function renderLogin() {
  const app = document.getElementById("app");

  // Load required stylesheets
  loadCSS("./pages/auth/login.css");
  await loadCSS("../../utils/notifications.css");

  // Fetch and inject login form HTML
  const res = await fetch("./pages/auth/login.html");
  const html = await res.text();
  app.innerHTML = html;

  // Attach event handlers
  document.getElementById("loginBtn").onclick = login;
  document.getElementById("goRegister").onclick = renderRegister;
}

/**
 * Handles user login
 * Validates credentials and redirects based on user role
 */
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send login request to backend API
    const res = await fetch(`${CONFIG.API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Handle login failure
    if (!res.ok) {
      notifications.error(data.message || "Login failed", "Error");
      return;
    }

    // Notify user of successful login
    notifications.success(
      `Welcome back, ${data.user.firstName}!`,
      "Login Successful",
      2000,
    );

    // Store authentication data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Brief delay to show success message before redirect
    setTimeout(() => {
      // Redirect based on user role
      if (data.user.role === "admin") {
        renderAdminDashboard();
      } else if (data.user.role === "student") {
        renderStudentLayout();
      }
    }, 1500);
  } catch (err) {
    // Handle network or server errors
    console.error("Login error:", err);
    notifications.error("Server error. Please try again.", "Connection Error");
  }
}
