import { loadCSS } from "../../../utils/loadCSS.js";
import CONFIG from "../../../config.js";
import notifications from "../../../utils/notifications.js";

/**
 * Renders the contact page
 * Loads CSS, fetches HTML, and sets up form submission handler
 */
export async function renderContact() {
  const app = document.getElementById("app");

  await loadCSS("./pages/public/contact/contact.css");
  await loadCSS("../../../utils/notifications.css");

  const res = await fetch("./pages/public/contact/contact.html");
  app.innerHTML = await res.text();

  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      notifications.warning("All fields are required", "Missing Information");
      return;
    }

    try {
      // Send contact form data to backend API
      const response = await fetch(`${CONFIG.API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        notifications.success("Message sent successfully!", "Thank You", 3000);
        form.reset();
        // Clear status text if using it
        if (status) status.textContent = "";
      } else {
        notifications.error(result.error || "Something went wrong", "Error");
        if (status) status.textContent = "";
      }
    } catch (err) {
      console.error("Contact form error:", err);
      notifications.error(
        "Server error. Please try again.",
        "Connection Error",
      );
      if (status) status.textContent = "";
    }
  });
}
