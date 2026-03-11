import { loadCSS } from "../../utils/loadCSS.js";
import { renderLogin } from "./login.js";
import notifications from "../../utils/notifications.js";

export async function renderRegister() {
  const app = document.getElementById("app");

  loadCSS("./pages/auth/register.css");
  await loadCSS("../../utils/notifications.css");

  const res = await fetch("./pages/auth/register.html");
  app.innerHTML = await res.text();

  document.getElementById("registerBtn").addEventListener("click", register);
  document.getElementById("goLogin").addEventListener("click", renderLogin);
}

// 🔥 NEW: Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function register() {
  const formData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    department: document.getElementById("department").value,
    section: document.getElementById("section").value,
    year: document.getElementById("year").value,
  };

  // Frontend validation
  for (let key in formData) {
    if (!formData[key]) {
      notifications.warning("All fields are required", "Missing Information");
      return;
    }
  }

  // 🔥 NEW: Validate email format
  if (!isValidEmail(formData.email)) {
    notifications.error(
      "Please enter a valid email address (e.g., [email protected])",
      "Invalid Email",
    );
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      notifications.error(data.message || "Registration failed", "Error");
      return;
    }

    notifications.success("Registration successful! Please login.", "Welcome!");

    // Small delay before redirect so user sees success message
    setTimeout(() => {
      renderLogin();
    }, 1500);
  } catch (error) {
    console.error("Register error:", error);
    notifications.error("Unable to connect to server.", "Connection Error");
  }
}
