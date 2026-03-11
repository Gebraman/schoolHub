// sw.js - Updated for push notifications
self.addEventListener("message", function (event) {
  console.log("📨 Service Worker received:", event.data);

  if (event.data.type === "class-reminder") {
    self.registration.showNotification("📚 Class Reminder", {
      body: `${event.data.className} starts in 5 minutes`,
      icon: "/icon.png",
      vibrate: [200, 100, 200],
      tag: "class-reminder",
    });
  }
});

// Add push event listener for server-sent notifications
self.addEventListener("push", function (event) {
  console.log("📨 Push received from server:", event);

  let data = { title: "EduSphere", body: "New notification" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icon.png",
    vibrate: [200, 100, 200],
    data: data.data || {},
    tag: data.tag || "notification",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(clients.openWindow("/"));
});
