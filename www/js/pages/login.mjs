import { RequestHandler } from "../RequestHandler.js";

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const loginPageHandler = (requestHandler, store, pages) => {
  $(pages.login).on("pagebeforeshow", function (e) {
    const isAuthenticated = requestHandler.isAuthenticated;

    console.log("isAuthenticated", isAuthenticated, store.user);

    // if the token is not available is not available
    // user must provide the login credentials and login
    if (!isAuthenticated) return;

    // if isAuthenticated but user object is not available
    if (!store.user) {
      // populate the user if isAuthenticated and the user is not available
      requestHandler
        .getUser()
        .then((result) => {
          const user = result?.user;
          // set user in the store
          store.user = user;
          onAuthSuccess();
        })
        .catch((error) => {
          console.error("There was an error fetching user", error);
        });
    } else {
      onAuthSuccess();
    }
  });

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const credentials = {
      email: "test123@gmail.com",
      password: "test123",
    };

    requestHandler
      .sendLoginRequest(credentials)
      .then(({ user, accessToken, resultCode }) => {
        // set the user in the global store
        store.user = user;

        // set the token in the request handler
        requestHandler.setToken(accessToken);

        const isSuccess = resultCode === "00047";
        if (isSuccess) {
          onAuthSuccess();
        }
      })
      .catch((error) => {
        console.error("There was an error logging in", error);
        alert("There was an error logging in", error);
      });
  });

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  function onAuthSuccess() {
    const pageToNavigate = store.user.isVerified
      ? pages.home
      : pages.emailVerification;

    console.log("authSuccess triggered, pageToNavigate", pageToNavigate);

    $.mobile.changePage(pageToNavigate, {
      transition: "fade",
    });
  }
};
