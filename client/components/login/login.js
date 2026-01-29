function renderLogin() {
  app.innerHTML = `
    <div class="login-container">
      <section class="login-form-section">
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to continue your learning journey</p>

        <form class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
          </div>

          <button type="submit" class="login-btn">Sign In</button>

          <div class="form-links">
            <a href="#" class="forgot-password">Forgot Password?</a>
            <a href="#" class="signup-link">Don't have an account? Sign up</a>
          </div>
        </form>
      </section>
    </div>
  `;

  const form = document.querySelector(".login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        if (typeof show === "function") show(renderDashboard);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Network error");
    }
  });
}
