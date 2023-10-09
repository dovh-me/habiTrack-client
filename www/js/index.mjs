import { RequestHandler } from "./RequestHandler.js";
import { FullWidthDatePicker } from "./components/FullWidthDatePicker.js";
import { createHabitPageHandler } from "./pages/create-habit.mjs";
import { emailVerificationPageHandler } from "./pages/email-verification.mjs";
import { habitSummaryPageHandler } from "./pages/habit-summary.mjs";
import { homePageHandler } from "./pages/home.mjs";
import { loginPageHandler } from "./pages/login.mjs";
import { signUpHandler } from "./pages/signup.mjs";
import { viewHabitPageHandler } from "./pages/view-habit.mjs";

const requestHandler = new RequestHandler();
const store = {};
const pages = {
  login: "#login-page",
  signUp: "#signUp-page",
  home: "#home-page",
  emailVerification: "#email-verification-page",
  viewHabit: "#view-habit-page",
  habitSummary: "#habit-summary-page",
};

// load custom datepickers
$(".full-width-datepicker-container")
  .toArray()
  .forEach((field) => {
    FullWidthDatePicker(field);
  });

//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------

$.validator.addMethod(
  "valueNotEquals",
  function (value, element, arg) {
    console.log("within custom method valueNotEquals", value, arg);
    return arg !== value;
  },
  "You must select a value for this field"
);

//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------

// Extra care has been taken to make sure that cordova plugins are not accessed directly within
// the page handlers
loginPageHandler(requestHandler, store, pages);
signUpHandler(requestHandler, store, pages);
emailVerificationPageHandler(requestHandler, store, pages);
homePageHandler(requestHandler, store, pages);
createHabitPageHandler(requestHandler, store, pages);
viewHabitPageHandler(requestHandler, store, pages);
habitSummaryPageHandler(requestHandler, store, pages);
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  function scheduleNotification() {
    cordova.plugins.notification.local.schedule({
      id: 1,
      title: "Meditating",
      text: "Consistency is the key to develop habits",
      trigger: {
        every: {
          hour: 15,
          minute: 0,
        },
      },
    });
    cordova.plugins.notification.local.schedule({
      id: 2,
      title: "SOmething",
      text: "Consistency is the key to develop habits",
      trigger: {
        every: {
          hour: 15,
          minute: 0,
        },
      },
    });
  }

  cordova.plugins.notification.local.hasPermission(function (granted) {
    if (!granted) {
      alert(
        `It seems that we are unable to request permission to send notifications.\n\nPlease enable notifications from the settings for app manually. Sorry for the inconvenience caused.\n\nSettings > All Apps > HabitTrack > Notifications`
      );
      cordova.plugins.notification.local.requestPermission(function (granted) {
        console.log(
          "granted object in request permissions",
          JSON.stringify(granted)
        );

        scheduleNotification();
      });
      return;
    }
    scheduleNotification();
  });

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
