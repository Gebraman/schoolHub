async function enroll(courseId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000/api/enrollments/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const data = await res.json();
  alert(data.message);
}
