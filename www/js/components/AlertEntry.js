import { RequestHandler } from "../RequestHandler.js";

/**
 *
 * @param {*} notification
 * @param {RequestHandler} requestHandler
 * @param {*} store
 */
export const AlertEntry = (notification, requestHandler, store, sibling) => {
  let hourValue = notification?.time?.hour ?? "--";
  let minuteValue = notification?.time?.minute ?? "--";
  if (notification?.time?.hour && notification?.time?.minute) {
    hourValue = hourValue >= 10 ? hourValue : `0${hourValue}`;
    minuteValue = minuteValue >= 10 ? minuteValue : `0${minuteValue}`;
  }

  const $el = $(`
        <div id="${notification._id}" class="alert-entry ui-nodisc-icon">
            <div class="time-container">
                <div class="hours">${hourValue}</div>
                <div>:</div>
                <div class="minutes">${minuteValue}</div>
                <div class="am-pm">${
                  (notification.time.hour ?? 0) >= 12 ? "PM" : "AM"
                }</div>
            </div>
            <button class="delete-button ui-btn ui-icon-custom-cancel ui-btn-icon-notext">Remove</button>
        </div>
    `);

  sibling.append($el);

  const deleteButton = $el.find(".delete-button");

  deleteButton.on("click", function (e) {
    e.preventDefault();

    // send the alert delete request
    requestHandler
      .deleteAlertRequest(notification._id)
      .then((result) => {
        // don't execute any further if the status code is different
        if (result.resultCode !== "00630")
          throw new Error("Received status code", result.resultCode);

        store.notificationHandler.cancel(result.data.notificationId);

        $el.remove();
      })
      .catch((error) => {
        const message = "There was an error deleting the alert";
        alert(message);
        console.log(message, error);
      });
  });

  return $el;
};
