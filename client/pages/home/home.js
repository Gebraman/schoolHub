import { loadCSS } from "../../utils/loadCSS.js";

export async function renderHome() {
  const app = document.getElementById("app");

  // Load page CSS once
  await loadCSS("./pages/home/home.css");

  // Load page HTML
  const res = await fetch("./pages/home/home.html");
  const html = await res.text();

  app.innerHTML = html;
}
