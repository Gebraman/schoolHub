// utils/router.js

export function loadPage(renderFn) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  renderFn();
}
