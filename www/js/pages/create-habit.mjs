import { RequestHandler } from "../RequestHandler.js";

/**
 *
 * @param {RequestHandler} requestHandler
 * @param {*} store
 * @param {*} pages
 */
export const createHabitPageHandler = (requestHandler, store, pages) => {
  const formFields = {
    "#habit-color": {
      requestField: "color",
    },
    "#habit-name": {
      requestField: "name",
    },
    "#custom-select-habit-type": {
      // requestField: ""
    },
    "#habit-goal-input": {
      requestField: "goal",
      isNumber: true,
    },
    "#custom-select-habit-goal-unit": {
      requestField: "goalUnits",
    },
    "#custom-select-habit-repetition": {
      requestField: "repetition",
    },
  };

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  const validator = registerCreateHabitFormValidator();

  // manually validating the form fields on change event
  // This is suppose to be default behaviour of the validator plugin
  // but doesn't work for some reason. Therefore, done manually.
  Object.keys(formFields).forEach((item) => {
    $(item).on("change", function (e) {
      e.preventDefault();
      validator.element(item);
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

  $("#create-habit-button").on("click", function (e) {
    e.preventDefault();

    // validate the form on button click
    validator.form();

    // prevent the submit action if the entered values are invalid
    if (!validator.valid()) return;

    // disable the create habit button if form inputs are valid
    $(e.currentTarget).prop("disabled", true);

    const form = $("#create-habit-form");
    // disable the form until the request has been processed
    const elements = form.find("input, button, a, select");
    elements.toArray().forEach((elem) => {
      $(elem).prop("disabled", true);
    });

    // request map for create habit

    // get the values from the form
    const requestBody = {};
    Object.keys(formFields).forEach((field) => {
      const formField = formFields[field];
      const requestKey = formField?.requestField;
      if (!requestKey) return;

      // get value from the DOM element
      let value = $(field)?.val();
      // convert to number if isNumber is true
      value = formField?.isNumber ?? false ? +value : value;

      requestBody[requestKey] = value;
    });
    // send the post request to the server using the requestHandler

    // TODO: implement custom alerts
    requestHandler
      .sendCreateHabitRequest(requestBody)
      .then(() => {
        alert("Habit Created Successfully!");

        const pageToNavigate = pages.home;
        $.mobile.changePage(pageToNavigate, {
          transition: "fade",
        });
      })
      .catch((e) => {
        const message = "There was an error creating the habit";
        console.error(message, e);
        alert(message);
      });
  });
};

//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------

function registerCreateHabitFormValidator() {
  const validator = $("#create-habit-form").validate({
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
      "habit-color": "required",
      "habit-name": "required",
      "custom-select-habit-type": {
        valueNotEquals: "Select Habit Type",
      },
      "habit-goal-input": {
        number: true,
        required: true,
      },
      "custom-select-habit-goal-unit": {
        valueNotEquals: "Select Goal Unit",
      },
      "custom-select-habit-repetition": {
        valueNotEquals: "Select Repetition",
      },
    },
  });

  return validator;
}
