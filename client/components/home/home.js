function renderHome() {
  app.innerHTML = `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="home-hero">
        <h1 class="home-title">Welcome to Your Learning Journey</h1>
        <p class="home-subtitle">Discover endless possibilities with SchoolHub</p>
        <button class="home-cta-button">Start Learning Today</button>
      </section>
      
      <!-- Features Section -->
      <section class="home-features">
        <h2 class="section-title">Why Choose SchoolHub?</h2>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3 class="feature-title">Expert Tutors</h3>
            <p class="feature-description">Connect with qualified tutors in every subject who are passionate about teaching</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3 class="feature-title">Flexible Learning</h3>
            <p class="feature-description">Study at your own pace, anytime, anywhere that suits your schedule</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3 class="feature-title">Track Progress</h3>
            <p class="feature-description">Monitor your learning journey with detailed analytics and progress reports</p>
          </div>
        </div>
      </section>
      
    
    </div>
  `;
}