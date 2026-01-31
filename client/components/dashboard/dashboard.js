function renderDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    show(renderLogin);
    return;
  }

  fetch("http://localhost:3000/api/dashboard/student", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      app.innerHTML = `
        <h2>Student Dashboard</h2>
        <p>Welcome, ${data.user?.name || "Student"}</p>

        <h3>Your Courses</h3>
        ${
          data.courses && data.courses.length
            ? `<ul>${data.courses
                .map(
                  (course) =>
                    `<li><strong>${course.title}</strong> – ${course.description}</li>`,
                )
                .join("")}</ul>`
            : `<p>You are not enrolled in any courses yet.</p>`
        }
      `;
    })
    .catch(() => {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      show(renderLogin);
    });
}
