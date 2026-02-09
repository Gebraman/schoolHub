import { loadCSS } from "../../utils/loadCSS.js";
import { renderLogin } from "./login.js";

export async function renderRegister() {
  const app = document.getElementById("app");

  loadCSS("./pages/auth/register.css");

  const res = await fetch("./pages/auth/register.html");
  app.innerHTML = await res.text();

  document.getElementById("registerBtn").onclick = register;
  document.getElementById("goLogin").onclick = renderLogin;
}

async function register() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !department ||
    !section
  ) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        department,
        section,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please login.");
    renderLogin();
  } catch (err) {
    console.error("Register error:", err);
    alert("Server error");
  }
}
