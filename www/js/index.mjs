import { RequestHandler } from "./RequestHandler.js";
import { FullWidthDatePicker } from "./components/FullWidthDatePicker.js";
import { createHabitPageHandler } from "./pages/create-habit.mjs";
import { editHabitPageHandler } from "./pages/edit-habit-page.js";
import { emailVerificationPageHandler } from "./pages/email-verification.mjs";
import { habitSummaryPageHandler } from "./pages/habit-summary.mjs";
import { homePageHandler } from "./pages/home.mjs";
import { loginPageHandler } from "./pages/login.mjs";
import { signUpHandler } from "./pages/signup.mjs";
import { viewHabitPageHandler } from "./pages/view-habit.mjs";
import { NotificationHandler } from "./util/NotificationHandler.js";

const requestHandler = new RequestHandler();
const notificationHandler = new NotificationHandler();
const store = {
  notificationHandler: notificationHandler,
};
const pages = {
  login: "#login-page",
  signUp: "#signUp-page",
  home: "#home-page",
  emailVerification: "#email-verification-page",
  viewHabit: "#view-habit-page",
  habitSummary: "#habit-summary-page",
  editHabit: "#edit-habit-page",
  createHabit: "#create-habit-page",
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
editHabitPageHandler(requestHandler, store, pages);
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
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
