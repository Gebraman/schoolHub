function renderAbout() {
  app.innerHTML = `
    <div class="about-container">
      <section class="about-hero">
        <h1 class="about-title">About SchoolHub</h1>
        <p class="about-subtitle">Connecting learners and educators worldwide</p>
      </section>
      
      <section class="about-content">
        <div class="about-story">
          <h2 class="section-title">Our Story</h2>
          <p class="text-paragraph">SchoolHub was founded with a simple mission: to make quality education accessible to everyone, everywhere.</p>
          <p class="text-paragraph">We believe that learning should be flexible, engaging, and tailored to each individual's needs and goals.</p>
        </div>
        
        <div class="about-values">
          <h2 class="section-title">Our Values</h2>
          <div class="values-grid">
            <div class="value-item">
              <h3>Excellence</h3>
              <p>We strive for the highest quality in education</p>
            </div>
            <div class="value-item">
              <h3>Innovation</h3>
              <p>We embrace new technologies and methods</p>
            </div>
            <div class="value-item">
              <h3>Accessibility</h3>
              <p>Education should be available to everyone</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}