import { loadCSS } from "../../utils/loadCSS.js";

export async function renderCourses() {
  const app = document.getElementById("app");

  // 1. Load page-specific CSS
  loadCSS("./pages/courses/courses.css");

  // 2. Load HTML
  const res = await fetch("./pages/courses/courses.html");
  const html = await res.text();

  // 3. Render
  app.innerHTML = html;

  // 4. (Next step) attach logic here
  // fetchCourses();
}
