import { loadCSS } from "../../utils/loadCSS.js";

export async function renderUploadAssignment() {
  const adminContent = document.getElementById("adminContent");

  // Load CSS
  await loadCSS("./pages/admin/uploadAssignment.css");

  // Load HTML
  const res = await fetch("./pages/admin/uploadAssignment.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // Event for button (just placeholder for now)
  document.getElementById("uploadAssignmentBtn").onclick = uploadAssignment;
}

function uploadAssignment() {
  const courseTitle = document.getElementById("assignmentCourse").value;
  const file = document.getElementById("assignmentFile").files[0];

  if (!courseTitle || !file) {
    alert("Please select a course and a file");
    return;
  }

  alert("✅ Assignment ready to upload (backend integration later)");
}
