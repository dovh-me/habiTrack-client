export class NotificationHandler {
  schedule(notification) {
    console.log(
      "logging notification",
      notification,
      cordova.plugins.notification.local
    );
    cordova.plugins.notification.local.schedule({
      id: notification.notificationId,
      title: notification.title,
      text: notification.text,
      trigger: {
        every: {
          hour: notification.time.hour,
          minute: notification.time.minute,
        },
      },
    });
  }

  cancelAll() {
    console.log("Cancelling all alerts");
    // cancel all the scheduled alerts
    cordova.plugins.notification.local.cancelAll(function () {
      console.log("cancel all alerts success");
    });
  }

  // verify if this works
  cancel(notificationId) {
    cordova.plugins.notification.local.cancel(notificationId);
  }
}
