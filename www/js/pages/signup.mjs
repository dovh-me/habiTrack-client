import { RequestHandler } from "../RequestHandler.js";

const formFields = {
  "#signup-email-input": {
    requestField: "email",
  },
  "#signup-name-input": {
    requestField: "name",
  },
  "#signup-password-input": {
    requestField: "",
  },
  "#signup-confirm-password-input": {},
  "#signup-username-input": {
    requestField: "goal",
  },
};

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const signUpHandler = (requestHandler, store, pages) => {
  const validator = registerSignUpFormValidator();
  // manually validating the form fields on change event
  // This is suppose to be default behaviour of the validator plugin
  // but doesn't work for some reason. Therefore, done manually.
  Object.keys(formFields).forEach((item) => {
    $(item).on("change", function (e) {
      e.preventDefault();
      validator.element(item);
    });
  });

  $(pages.login).on("pagebeforeshow", function (e) {
    validator.resetForm();
  });

  function getSignupFormCredentials() {
    const nameInput = $("#signup-name-input");
    const emailInput = $("#signup-email-input");
    const usernameInput = $("#signup-username-input");
    const passwordInput = $("#signup-password-input");
    // const confirmInput = $("#signup-password-input");

    return {
      email: emailInput.val(),
      name: nameInput.val(),
      username: usernameInput.val(),
      password: passwordInput.val(),
    };
  }

  function registerSignUpFormValidator() {
    const validator = $("#signup-form").validate({
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
        "signup-email-input": {
          email: true,
          required: true,
        },
        "signup-password-input": {
          minlength: 6,
          maxlength: 20,
          required: true,
          equalTo: "#signup-confirm-password-input",
        },
        "signup-confirm-password-input": {
          minlength: 6,
          maxlength: 20,
          required: true,
          equalTo: "#signup-password-input",
        },
        "signup-name-input": "required",
        "signup-username-input": "required",
      },
      submitHandler,
    });

    function submitHandler(e) {
      if (!validator.valid()) return;

      const credentials = getSignupFormCredentials();

      requestHandler
        .sendSignUpRequest(credentials)
        .then(({ user }) => {
          $.mobile.changePage(pages["login"], {
            transition: "fade",
          });
        })
        .catch((error) => {
          const responseJSON = error.responseJSON;
          console.error("There was an error signing up", responseJSON);
          alert(
            `There was an error signing up\nError: ${responseJSON.resultMessage?.en}\nCode: ${responseJSON.resultCode}`
          );
        });
    }
    return validator;
  }
};
