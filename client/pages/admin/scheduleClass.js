import { loadCSS } from "../../utils/loadCSS.js";

export async function renderScheduleClass() {
  const adminContent = document.getElementById("adminContent");

  if (!adminContent) {
    console.error("adminContent not found");
    return;
  }

  // load css
  await loadCSS("./pages/admin/scheduleClass.css");

  // load html
  const res = await fetch("./pages/admin/scheduleClass.html");
  const html = await res.text();
  adminContent.innerHTML = html;

  // event
  document.getElementById("scheduleClassBtn").onclick = scheduleClass;
}

function scheduleClass() {
  const date = document.getElementById("classDate").value;
  const time = document.getElementById("classTime").value;
  const room = document.getElementById("classRoom").value;
  const link = document.getElementById("classLink").value;

  if (!date || !time || (!room && !link)) {
    alert("Please fill date, time and room or online link");
    return;
  }

  alert("✅ Class scheduled (backend integration comes later)");
}
