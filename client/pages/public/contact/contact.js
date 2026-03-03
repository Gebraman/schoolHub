import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderContact() {
  const app = document.getElementById("app");

  await loadCSS("./pages/public/contact/contact.css");

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

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        status.textContent = "Message sent successfully ✅";
        form.reset();
      } else {
        status.textContent = result.error || "Something went wrong";
      }
    } catch (err) {
      status.textContent = "Server error. Try again.";
    }
  });
}
