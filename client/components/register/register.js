// components/register/register.js

function renderRegister() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="register">
      <h2>Create Account</h2>
      <p>Join SchoolHub and start learning 🚀</p>

      <form id="registerForm">
        <input type="text" id="name" placeholder="Full Name" required />
        <input type="email" id="email" placeholder="Email Address" required />
        <input type="password" id="password" placeholder="Password (min 6 chars)" required />

        <button type="submit">Register</button>
      </form>

      <small>
        Already have an account?
        <span id="goLogin">Login</span>
      </small>
    </section>
  `;

  // Handle form submit
  document
    .getElementById("registerForm")
    .addEventListener("submit", handleRegister);

  // Navigate to login
  document
    .getElementById("goLogin")
    .addEventListener("click", () => show(renderLogin));
}

// 🔐 Register Logic (real backend)
async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || password.length < 6) {
    alert("Please enter valid information");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // If server returned non-OK, try to read a helpful message
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        alert(json.message || "Server error");
      } catch (e) {
        // Response may be HTML (404 page) or plain text
        const stripped = text.replace(/<[^>]*>/g, "").trim();
        alert(stripped || "Server error");
        console.error("Non-JSON response from server:", text);
      }
      return;
    }

    const data = await res.json();
    alert(data.message || "Registration successful! Please login.");
    show(renderLogin);
  } catch (err) {
    alert("Server error. Try again later.");
    console.error(err);
  }
}
