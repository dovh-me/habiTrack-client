import { RequestHandler } from "../RequestHandler.js";

const formFields = {
  "#login-email-input": {
    requestField: "email",
  },
  "#login-password-input": {
    requestField: "password",
  },
};

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const loginPageHandler = (requestHandler, store, pages) => {
  const validator = registerLoginFormValidator();
  Object.keys(formFields).forEach((item) => {
    $(item).on("change", function (e) {
      e.preventDefault();
      validator.element(item);
    });
  });

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
  function registerLoginFormValidator() {
    const validator = $("#login-form").validate({
      highlight: function (element, errorClass, validClass) {
        $(element).removeClass(validClass);
        $(element.form)
          .find("label[for=" + element.id + "]")
          .addClass(errorClass);
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).addClass(validClass);
        $(element.form)
          .find("label[for=" + element.id + "]")
          .removeClass(errorClass);
      },
      rules: {
        "login-email-input": {
          email: true,
          required: true,
        },
        "login-password-input": {
          minlength: 6,
          maxlength: 20,
          required: true,
        },
      },
      submitHandler,
    });

    function submitHandler(e) {
      if (!validator.valid()) return;

      const credentials = getLoginFormCredentials();

      requestHandler
        .sendLoginRequest(credentials)
        .then(({ user, accessToken, resultCode }) => {
          // set the user in the global store
          store.user = user;

          const isSuccess = resultCode === "00047";
          if (isSuccess) {
            onAuthSuccess();
          }
        })
        .catch((error) => {
          console.error("There was an error logging in", error);
          alert("There was an error logging in", error);
        });
    }
    return validator;
  }

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

  function getLoginFormCredentials() {
    const emailInput = $("#login-email-input");
    const passwordInput = $("#login-password-input");

    return {
      email: emailInput.val(),
      password: passwordInput.val(),
    };
  }
};
