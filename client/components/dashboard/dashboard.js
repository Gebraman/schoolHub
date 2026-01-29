function renderDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    show(renderLogin);
    return;
  }

  fetch("http://localhost:3000/api/user/dashboard", {
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
        <h2>Dashboard</h2>
        <p>${data.message}</p>
        <p>User ID: ${data.user.id}</p>
        <p>Role: ${data.user.role}</p>
      `;
    })
    .catch(() => {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      show(renderLogin);
    });
}
