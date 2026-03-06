import { loadCSS } from "../../utils/loadCSS.js";

export async function renderHome() {
  const app = document.getElementById("app");
  // 1. Load CSS;
  loadCSS("./pages/home/home.css");

  // 2. Load HTML
  const res = await fetch("./pages/home/home.html");
  const html = await res.text();

  app.innerHTML = html;
  // 3. Attach logic
}
