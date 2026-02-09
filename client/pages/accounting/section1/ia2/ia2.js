import { getUser } from "../../../utils/auth.js";

export async function renderIA2() {
  const app = document.getElementById("app");

  // Load HTML
  const res = await fetch("./pages/accounting/section1/ia2/ia2.html");
  app.innerHTML = await res.text();

  const user = getUser();

  // 1️⃣ Load Schedule
  loadSchedule();

  // 2️⃣ Load Materials
  loadMaterials();

  // 3️⃣ Permission: ONLY rep can upload
  if (user.role === "rep") {
    document.getElementById("uploadSection").classList.remove("hidden");
    setupUpload();
  }
}

async function loadSchedule() {
  // fake data for now
  const schedule = {
    days: ["Monday", "Wednesday"],
    time: "2:00 PM – 3:30 PM",
    room: "Block B – Room 204",
  };

  document.getElementById("scheduleInfo").textContent = `${schedule.days.join(
    " & ",
  )} | ${schedule.time} | ${schedule.room}`;
}

async function loadMaterials() {
  const materials = [
    { title: "Revenue Recognition", type: "pdf", url: "#" },
    { title: "Leases PPT", type: "ppt", url: "#" },
  ];

  const list = document.getElementById("materialsList");

  materials.forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${m.url}">${m.title} (${m.type})</a>`;
    list.appendChild(li);
  });
}

function setupUpload() {
  document.getElementById("uploadBtn").onclick = () => {
    alert("Material uploaded (demo)");
  };
}
