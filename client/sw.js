self.addEventListener("push", (event) => {
  let data = {
    title: "EduSphere",
    body: "New notification",
  };

  if (event.data) {
    try {
      data = event.data.json(); // backend JSON
    } catch (err) {
      data.body = event.data.text(); // DevTools text
    }
  }

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/pages/assets/bell.png",
  });
});
