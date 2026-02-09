import { loadCSS } from "../../utils/loadCSS.js";

export async function renderUploadMaterial() {
  const adminContent = document.getElementById("adminContent");

  // Load CSS
  await loadCSS("./pages/admin/uploadMaterial.css");

  // Load HTML
  const res = await fetch("./pages/admin/uploadMaterial.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // Event
  document.getElementById("uploadMaterialBtn").onclick = uploadMaterial;
}

async function uploadMaterial() {
  const courseTitle = document.getElementById("materialCourse").value;
  const section = document.getElementById("materialSection").value;
  const file = document.getElementById("materialFile").files[0];

  if (!file || !section) {
    alert("Please select a file and section");
    return;
  }

  alert("✅ File ready to upload (backend integration will come next)");
}
