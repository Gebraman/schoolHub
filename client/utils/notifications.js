// notifications.js - Professional toast notification system

class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    // Check if container already exists
    if (document.querySelector(".notification-container")) {
      this.container = document.querySelector(".notification-container");
      return;
    }

    // Create container
    this.container = document.createElement("div");
    this.container.className = "notification-container";
    document.body.appendChild(this.container);
  }

  /**
   * Show a success notification
   * @param {string} message - Notification message
   * @param {string} title - Optional title (defaults to "Success")
   * @param {number} duration - Time in ms (default: 3000)
   */
  success(message, title = "Success", duration = 3000) {
    this.show(message, title, "success", duration);
  }

  /**
   * Show an error notification
   * @param {string} message - Notification message
   * @param {string} title - Optional title (defaults to "Error")
   * @param {number} duration - Time in ms (default: 4000)
   */
  error(message, title = "Error", duration = 4000) {
    this.show(message, title, "error", duration);
  }

  /**
   * Show a warning notification
   * @param {string} message - Notification message
   * @param {string} title - Optional title (defaults to "Warning")
   * @param {number} duration - Time in ms (default: 3500)
   */
  warning(message, title = "Warning", duration = 3500) {
    this.show(message, title, "warning", duration);
  }

  /**
   * Show an info notification
   * @param {string} message - Notification message
   * @param {string} title - Optional title (defaults to "Info")
   * @param {number} duration - Time in ms (default: 3000)
   */
  info(message, title = "Info", duration = 3000) {
    this.show(message, title, "info", duration);
  }

  /**
   * Show a custom notification
   * @param {string} message - Notification message
   * @param {string} title - Notification title
   * @param {string} type - Type (success, error, warning, info)
   * @param {number} duration - Time in ms
   */
  show(message, title, type = "info", duration = 3000) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Icons for different types
    const icons = {
      success: "✓",
      error: "✗",
      warning: "⚠",
      info: "ℹ",
    };

    // Set notification content
    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || "ℹ"}</div>
      <div class="notification-content">
        <div class="notification-title">${this.escapeHtml(title)}</div>
        <div class="notification-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="notification-close" onclick="this.closest('.notification').remove()">✕</button>
      <div class="notification-progress" style="animation-duration: ${duration}ms"></div>
    `;

    // Add to container
    this.container.appendChild(notification);

    // Auto-remove after duration
    const timeoutId = setTimeout(() => {
      this.remove(notification);
    }, duration);

    // Store notification data
    this.notifications.push({
      element: notification,
      timeoutId,
    });

    // Add click handler to close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      clearTimeout(timeoutId);
      this.remove(notification);
    });

    // Hover pause functionality
    notification.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
      const progress = notification.querySelector(".notification-progress");
      if (progress) {
        progress.style.animationPlayState = "paused";
      }
    });

    notification.addEventListener("mouseleave", () => {
      const newTimeoutId = setTimeout(() => {
        this.remove(notification);
      }, 1000);

      // Update timeoutId in stored data
      const notifData = this.notifications.find(
        (n) => n.element === notification,
      );
      if (notifData) {
        notifData.timeoutId = newTimeoutId;
      }

      const progress = notification.querySelector(".notification-progress");
      if (progress) {
        progress.style.animationPlayState = "running";
      }
    });
  }

  /**
   * Remove a notification with animation
   * @param {HTMLElement} notification - Notification element to remove
   */
  remove(notification) {
    notification.classList.add("fade-out");

    setTimeout(() => {
      if (notification.parentNode === this.container) {
        this.container.removeChild(notification);
      }

      // Remove from stored array
      const index = this.notifications.findIndex(
        (n) => n.element === notification,
      );
      if (index !== -1) {
        clearTimeout(this.notifications[index].timeoutId);
        this.notifications.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Remove all notifications
   */
  clearAll() {
    this.notifications.forEach(({ element, timeoutId }) => {
      clearTimeout(timeoutId);
      if (element.parentNode === this.container) {
        element.classList.add("fade-out");
        setTimeout(() => {
          if (element.parentNode === this.container) {
            this.container.removeChild(element);
          }
        }, 300);
      }
    });
    this.notifications = [];
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

const notifications = new NotificationSystem();

export default notifications;
