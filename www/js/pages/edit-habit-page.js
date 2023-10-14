import { RequestHandler } from "../RequestHandler.js";

/**
 *
 * @param {RequestHandler} requestHandler
 * @param {*} store
 * @param {*} pages
 */
export const editHabitPageHandler = (requestHandler, store, pages) => {
  const formFields = {
    "#edit-habit-color": {
      requestField: "color",
    },
    "#edit-habit-name": {
      requestField: "name",
    },
    "#edit-habit-goal-input": {
      requestField: "goal",
    },
    "#edit-custom-select-habit-goal-unit": {
      requestField: "goalUnits",
      isSelect: true,
      noUpdate: true,
    },
    "#edit-custom-select-habit-repetition": {
      requestField: "repetition",
      isSelect: true,
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

  const validator = registerEditHabitFormValidator();

  // manually validating the form fields on change event
  // This is suppose to be default behaviour of the validator plugin
  // but doesn't work for some reason. Therefore, done manually.
  Object.keys(formFields).forEach((item) => {
    $(item).on("change", function (e) {
      e.preventDefault();
      validator.element(item);
    });
  });

  $("#cancel-edit-habit-button").on("click", function (e) {
    e.preventDefault();

    const pageToNavigate = pages.viewHabit;
    $.mobile.changePage(pageToNavigate, {
      transition: "fade",
    });
  });

  $(pages.editHabit).on("pagebeforeshow", function (e) {
    console.log("edit habit page loaded");
    loadDefaultValues();
  });

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  $("#edit-habit-button").on("click", function (e) {
    e.preventDefault();

    // validate the form on button click
    validator.form();

    // prevent the submit action if the entered values are invalid
    if (!validator.valid()) return;

    // disable the edit habit button if form inputs are valid
    $(e.currentTarget).prop("disabled", true);

    const form = $("#edit-habit-form");
    // disable the form until the request has been processed
    const elements = form.find("input, button, a, select");
    elements.toArray().forEach((elem) => {
      $(elem).prop("disabled", true);
    });

    // get the values from the form
    const requestBody = {};
    Object.keys(formFields).forEach((field) => {
      const formField = formFields[field];
      const requestKey = formField?.requestField;
      if (!requestKey || formField?.noUpdate) return;

      // get value from the DOM element
      let value = $(field)?.val();
      // convert to number if isNumber is true
      value = formField?.isNumber ?? false ? +value : value;

      requestBody[requestKey] = value;
    });
    // send the post request to the server using the requestHandler

    const habit = store.clickedHabit;
    // TODO: implement custom alerts
    requestHandler
      .sendUpdateHabitRequest(requestBody, habit._id)
      .then(() => {
        alert("Habit Updated Successfully!");

        const pageToNavigate = pages.home;
        $.mobile.changePage(pageToNavigate, {
          transition: "fade",
        });
      })
      .catch((e) => {
        const message = "There was an error updating the habit";
        console.error(message, e);
        alert(message);
      })
      .finally(() => {
        $(e.currentTarget).prop("disabled", false);
        // disable the form until the request has been processed
        const elements = form.find("input, button, a, select");
        elements.toArray().forEach((elem) => {
          $(elem).prop("disabled", false);
        });
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

  function loadDefaultValues() {
    const habit = store.clickedHabit;
    if (!habit) return;

    console.log("habit loading from edit page", habit);

    Object.keys(formFields).forEach((field) => {
      const formFieldEntry = formFields[field];
      const fieldValue = habit[formFieldEntry.requestField];
      if (!fieldValue) return;

      const jField = $(field);
      if (formFieldEntry.isSelect) {
        jField.val(fieldValue);
        jField.trigger("change");
      } else {
        jField.val(`${fieldValue}`);
      }
      console.log("field", field, fieldValue, $(field));
    });
  }
};

//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------
//----------------

function registerEditHabitFormValidator() {
  const validator = $("#edit-habit-form").validate({
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
      "edit-habit-color": "required",
      "edit-habit-name": "required",
      "edit-custom-select-habit-type": {
        valueNotEquals: "Select Habit Type",
      },
      "edit-habit-goal-input": {
        number: true,
        required: true,
      },
      "edit-custom-select-habit-goal-unit": {
        valueNotEquals: "Select Goal Unit",
      },
      "edit-custom-select-habit-repetition": {
        valueNotEquals: "Select Repetition",
      },
    },
  });

  return validator;
}
