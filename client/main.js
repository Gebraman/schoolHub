import { renderHome } from "./pages/home/home.js";
import { renderAbout } from "./pages/public/about/about.js";
import { renderContact } from "./pages/public/contact/contact.js";
import { renderLogin } from "./pages/auth/login.js";
import { renderRegister } from "./pages/auth/register.js";
import { renderAdminDashboard } from "./pages/admin/dashboard.js";
import { renderStudentLayout } from "./pages/student/layout/studentLayout.js";
import notifications from "./utils/notifications.js";
import CONFIG from "./config.js"; // Add this line

// Navbar routing
document.getElementById("navHome").onclick = renderHome;
document.getElementById("navAbout").onclick = renderAbout;
document.getElementById("navContact").onclick = renderContact;
document.getElementById("navLogin").onclick = renderLogin;
document.getElementById("navRegister").onclick = renderRegister;

document.getElementById("navLogout").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Show logout notification
  notifications.info("You have been logged out", "Goodbye!", 2000);

  renderHome();
  updateNavbar();
};

// Mobile menu
const hamburger = document.getElementById("hamburger");
const navList = document.getElementById("navList");
const navItems = document.querySelectorAll("#navList li");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navList.classList.toggle("show");
  document.body.classList.toggle("menu-open");

  // Debug log
  console.log(
    "Menu toggled:",
    navList.classList.contains("show") ? "open" : "closed",
  );
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navList.classList.remove("show");
    document.body.classList.remove("menu-open");
  });
});

function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navLogin = document.getElementById("navLogin");
  const navRegister = document.getElementById("navRegister");
  const navDashboard = document.getElementById("navDashboard");
  const navLogout = document.getElementById("navLogout");

  // Always clean mobile state
  document.body.classList.remove("menu-open");
  document.getElementById("app").style.marginLeft = "0";

  if (user) {
    navLogin.style.display = "none";
    navRegister.style.display = "none";
    navDashboard.style.display = "inline-block";
    navLogout.style.display = "inline-block";

    if (user.role === "admin") {
      navDashboard.onclick = renderAdminDashboard;
    } else if (user.role === "student") {
      navDashboard.onclick = renderStudentLayout;
    }

    // Welcome back notification (only once per session)
    if (!sessionStorage.getItem("welcomeShown")) {
      setTimeout(() => {
        notifications.success(
          `Welcome back, ${user.firstName || "User"}!`,
          "👋 Hello",
          3000,
        );
        sessionStorage.setItem("welcomeShown", "true");
      }, 1000);
    }
  } else {
    navLogin.style.display = "inline-block";
    navRegister.style.display = "inline-block";
    navDashboard.style.display = "none";
    navLogout.style.display = "none";
  }
}

// ========== PUSH NOTIFICATION CODE ==========

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("✅ Service Worker Registered");
    })
    .catch((error) => {
      console.error("❌ Service Worker registration failed:", error);
      notifications.error(
        "Failed to register notifications",
        "Service Worker Error",
      );
    });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Subscribe to push notifications
async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "student") {
      console.log("⏭️ Skipping push subscription: User not eligible");
      return;
    }

    if (!user.department || !user.section || !user.year) {
      console.log(
        "⚠️ User missing department/section/year for push subscription",
      );
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BFzSHaRE0EQ5VUlxu7GVhuL8sig7JJTHWu8Iy8OKcz-8Kk4X-o2qG4-iqFOwiLTT6pMfSRDxt9kgU0s12Zwnix8",
      ),
    });

    // FIXED: Use CONFIG.API_URL instead of hardcoded localhost
    const response = await fetch(`${CONFIG.API_URL}/api/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscription,
        department: user.department,
        section: user.section,
        year: user.year,
      }),
    });

    if (response.ok) {
      console.log("✅ Successfully subscribed to push notifications");
      notifications.success(
        "You'll receive class reminders!",
        "Notifications Enabled",
        3000,
      );
    } else {
      console.error("❌ Server rejected subscription");
      notifications.error(
        "Failed to enable notifications",
        "Subscription Error",
      );
    }
  } catch (error) {
    console.error("❌ Push subscription failed:", error);
  }
}

// Request notification permission and subscribe
async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("❌ This browser does not support notifications");
    notifications.warning(
      "Your browser doesn't support notifications",
      "Not Available",
    );
    return false;
  }

  const permission = Notification.permission;

  if (permission === "granted") {
    console.log("✅ Notification permission already granted");
    await subscribeToPushNotifications();
    return true;
  }

  if (permission === "denied") {
    console.log("❌ Notification permission denied");
    notifications.error(
      "Please enable notifications in browser settings to receive class reminders",
      "Permission Denied",
      5000,
    );
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      console.log("✅ Notification permission granted");
      notifications.success(
        "Thanks! You'll now receive class reminders",
        "Notifications Enabled",
        4000,
      );
      await subscribeToPushNotifications();
      return true;
    } else {
      console.log("❌ Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return false;
  }
}

// Check for existing subscription on login
window.addEventListener("storage", (event) => {
  if (event.key === "user" || event.key === "token") {
    if (localStorage.getItem("user") && Notification.permission === "granted") {
      subscribeToPushNotifications();
    }
  }
});

// ========== START THE APP ==========
updateNavbar();
renderHome();

// Request notification permission
requestNotificationPermission();
