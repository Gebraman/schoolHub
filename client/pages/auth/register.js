import { loadCSS } from "../../utils/loadCSS.js";
import { renderLogin } from "./login.js";
import notifications from "../../utils/notifications.js";
import CONFIG from "../../config.js";

/**
 * Renders the registration page
 * Loads CSS, fetches HTML, and attaches event listeners
 */
export async function renderRegister() {
  const app = document.getElementById("app");

  loadCSS("./pages/auth/register.css");
  await loadCSS("../../utils/notifications.css");

  const res = await fetch("./pages/auth/register.html");
  app.innerHTML = await res.text();

  document.getElementById("registerBtn").addEventListener("click", register);
  document.getElementById("goLogin").addEventListener("click", renderLogin);
}

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handles user registration
 * Validates input, sends data to server, and redirects on success
 */
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

  // Check for empty fields
  for (let key in formData) {
    if (!formData[key]) {
      notifications.warning("All fields are required", "Missing Information");
      return;
    }
  }

  // Validate email format
  if (!isValidEmail(formData.email)) {
    notifications.error(
      "Please enter a valid email address (e.g., [email protected])",
      "Invalid Email",
    );
    return;
  }

  try {
    // Send registration request to backend API
    const response = await fetch(`${CONFIG.API_URL}/api/auth/register`, {
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

    // Brief delay to show success message before redirect
    setTimeout(() => {
      renderLogin();
    }, 1500);
  } catch (error) {
    console.error("Register error:", error);
    notifications.error("Unable to connect to server.", "Connection Error");
  }
}
