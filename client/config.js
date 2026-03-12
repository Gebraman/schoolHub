// client/config.js
const CONFIG = {
  API_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://edusphere-zouk.onrender.com",

  DOMAIN:
    window.location.hostname === "localhost"
      ? "http://localhost:5500"
      : "https://edusphere-zouk.onrender.com",
};

export default CONFIG;
