document.addEventListener("DOMContentLoaded", () => {

  const app = document.getElementById("app");
  function show(view) {
    app.innerHTML = "";
    view();
  }
document.getElementById("home")?.addEventListener("click", () => show(renderHome));
document.getElementById("login")?.addEventListener("click", () => show(renderLogin));
document.getElementById("register")?.addEventListener("click", () => show(renderRegister));
document.getElementById("about")?.addEventListener("click", () => show(renderAbout));
document.getElementById("contact")?.addEventListener("click", () => show(renderContact));

// Default
show(renderHome); //default view is home 


  
});
 

