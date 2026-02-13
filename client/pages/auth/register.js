import { loadCSS } from "../../utils/loadCSS.js";
import { renderLogin } from "./login.js";

export async function renderRegister() {
  const app = document.getElementById("app");

  loadCSS("./pages/auth/register.css");

  const res = await fetch("./pages/auth/register.html");
  app.innerHTML = await res.text();

  document.getElementById("registerBtn").addEventListener("click", register);
  document.getElementById("goLogin").addEventListener("click", renderLogin);
}

async function register() {
  const formData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    department: document.getElementById("department").value,
    section: document.getElementById("section").value,
  };

  // Frontend validation (UX purpose only)
  for (let key in formData) {
    if (!formData[key]) {
      alert("All fields are required");
      return;
    }
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please login.");
    renderLogin(); // ✅ Correct flow
  } catch (error) {
    console.error("Register error:", error);
    alert("Unable to connect to server.");
  }
}
