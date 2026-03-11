import { loadCSS } from "../../utils/loadCSS.js";
import { renderRegister } from "./register.js";
import { renderAdminDashboard } from "../admin/dashboard.js";
import { renderStudentLayout } from "../student/layout/studentLayout.js";
import notifications from "../../utils/notifications.js";

export async function renderLogin() {
  const app = document.getElementById("app");

  // 1. Load CSS
  loadCSS("./pages/auth/login.css");
  await loadCSS("../../utils/notifications.css");

  // 2. Load HTML
  const res = await fetch("./pages/auth/login.html");
  const html = await res.text();

  // 3. Render
  app.innerHTML = html;

  // 4. Attach logic
  document.getElementById("loginBtn").onclick = login;
  document.getElementById("goRegister").onclick = renderRegister;
}

async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      notifications.error(data.message || "Login failed", "Error");
      return;
    }

    // Show success notification
    notifications.success(
      `Welcome back, ${data.user.firstName}!`,
      "Login Successful",
      2000,
    );

    // ✅ MUST store BOTH token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Small delay so user sees success message before redirect
    setTimeout(() => {
      // 🔀 Redirect based on role
      if (data.user.role === "admin") {
        renderAdminDashboard();
      } else if (data.user.role === "student") {
        renderStudentLayout();
      }
    }, 1500);
  } catch (err) {
    console.error("Login error:", err);
    notifications.error("Server error. Please try again.", "Connection Error");
  }
}
