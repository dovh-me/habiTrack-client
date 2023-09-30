import { RequestHandler } from "./RequestHandler.js";
import { emailVerificationPageHandler } from "./pages/email-verification.mjs";
import { homePageHandler } from "./pages/home.mjs";
import { loginPageHandler } from "./pages/login.mjs";
import { signUpHandler } from "./pages/signup.mjs";

const requestHandler = new RequestHandler();
const store = {};
const pages = {
  login: "#login-page",
  signUp: "#signUp-page",
  home: "#home-page",
  emailVerification: "#email-verification-page",
};

loginPageHandler(requestHandler, store, pages);
signUpHandler(requestHandler, store, pages);
emailVerificationPageHandler(requestHandler, store, pages);
homePageHandler(requestHandler, store, pages);

// registering jquery event handlers
$(function () {
  // Show the datepicker when field is clicked
  $(".date-picker-field").on("click", function (e) {
    e.currentTarget.showPicker();
  });
});

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
