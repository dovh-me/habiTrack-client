import { RequestHandler } from "./Store.mjs";
import { emailVerificationPageHandler } from "./pages/email-verification.mjs";
import { loginPageHandler } from "./pages/login.mjs";
import { signUpHandler } from "./pages/signup.mjs";

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  // registering jquery event handlers
  $(function () {
    const requestHandler = new RequestHandler();
    const store = {};
    const pages = {
      login: "#login-page",
      signUp: "#signUp-page",
      home: "#home-page",
    };

    loginPageHandler(requestHandler, store, pages);
    signUpHandler(requestHandler, store, pages);
    emailVerificationPageHandler(requestHandler, store, pages);
  });
}
