import { loadCSS } from "../../utils/loadCSS.js";

export async function renderScheduleClass() {
  const adminContent = document.getElementById("adminContent");

  if (!adminContent) {
    console.error("adminContent not found");
    return;
  }

  await loadCSS("./pages/admin/scheduleClass.css");

  const res = await fetch("./pages/admin/scheduleClass.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  await loadCourses();

  document.getElementById("scheduleClassBtn").onclick = scheduleClass;

  // ✅ Smooth scroll
  setTimeout(() => {
    const card = document.querySelector(".schedule-card");
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
}

async function loadCourses() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const courses = await res.json();

    const select = document.getElementById("scheduleCourse");

    select.innerHTML = '<option value="">Select Course</option>';

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.title;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Load courses error:", err);
  }
}

async function scheduleClass() {
  const courseId = document.getElementById("scheduleCourse").value;
  const date = document.getElementById("classDate").value;
  const time = document.getElementById("classTime").value;
  const location = document.getElementById("classLocation").value.trim();
  const section = document.getElementById("section").value;

  const token = localStorage.getItem("token");

  if (!courseId || !date || !time || !location || !section) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        course_id: courseId,
        class_date: date,
        class_time: time,
        location: location,
        section: section,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Schedule failed");
      return;
    }

    alert("✅ Class scheduled successfully");

    // ✅ Clear form
    document.getElementById("scheduleCourse").value = "";
    document.getElementById("classDate").value = "";
    document.getElementById("classTime").value = "";
    document.getElementById("classLocation").value = "";
    document.getElementById("section").value = "";
  } catch (err) {
    console.error("Schedule error:", err);
    alert("Server error");
  }
}
