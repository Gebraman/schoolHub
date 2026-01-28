function renderContact() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="contact">
      <h2>Contact Me</h2>
      <p>Let’s connect. I’m open for learning, collaboration, and growth.</p>

      <form class="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <input type="text" placeholder="Subject" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>

      <div class="social-links">
        <a href="https://www.linkedin.com" target="_blank">LinkedIn</a>
        <a href="https://www.facebook.com" target="_blank">Facebook</a>
        <a href="https://www.instagram.com" target="_blank">Instagram</a>
        <a href="mailto:yourname@email.com?subject=SchoolHub Contact">
          Email Me
        </a>
      </div>
    </section>
  `;
}
