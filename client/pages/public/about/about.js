import { loadCSS } from "../../../utils/loadCSS.js";

export async function renderAbout() {
  const app = document.getElementById("app");

  await loadCSS("./pages/public/about/about.css");

  const res = await fetch("./pages/public/about/about.html");
  const html = await res.text();

  app.innerHTML = html;
}
