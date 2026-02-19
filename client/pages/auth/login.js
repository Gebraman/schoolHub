import { loadCSS } from "../../utils/loadCSS.js";
import { renderAdminDashboard } from "../admin/dashboard.js";
import { renderStudentLayout } from "../student/layout/studentLayout.js";

export async function renderLogin() {
  const app = document.getElementById("app");

  // 1. Load CSS
  loadCSS("./pages/auth/login.css");

  // 2. Load HTML
  const res = await fetch("./pages/auth/login.html");
  const html = await res.text();

  // 3. Render
  app.innerHTML = html;

  // 4. Attach logic
  document.getElementById("loginBtn").onclick = login;
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
      alert(data.message || "Login failed");
      return;
    }

    // ✅ MUST store BOTH token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔀 Redirect based on role
    if (data.user.role === "admin") {
      renderAdminDashboard();
    } else if (data.user.role === "student") {
      renderStudentLayout();
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Server error");
  }
}
