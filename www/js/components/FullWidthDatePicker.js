import { formatDate } from "../util/formatDate.js";

export const FullWidthDatePicker = (field) => {
  const inputClass = "date-picker-field";
  const valueDisplayClass = "date-display";
  const previousButtonClass = "previous-date";
  const nextButtonClass = "next-date";
  const millisecondsInADay = 3600 * 24 * 1000;

  $(field).addClass("ui-nodisc-icon");

  $(field).html(`
        <button class="${previousButtonClass} ui-btn ui-icon-custom-previous ui-btn-icon-notext"></button>
        <div class="${valueDisplayClass}">Today</div>
        <button class="${nextButtonClass} ui-btn ui-icon-custom-next ui-btn-icon-notext"></button>
        <!-- using the native datepicker of the browser -->
        <input
          class="${inputClass}"
          type="date"
          data-role="none"
          max="${formatDate(new Date())}"
          min="${formatDate(new Date(2020, 0, 1))}"
        />
    `);

  const datepickerInput = $(field).find("." + inputClass);
  const previousButton = $(field).find("." + previousButtonClass);
  const nextButton = $(field).find("." + nextButtonClass);
  const datepickerValueField = $(field).find("." + valueDisplayClass);

  previousButton.on("click", function (e) {
    e.preventDefault();
    // set the previous date int he datepicker
    const currentDate = new Date(datepickerInput.val());
    const previousDate = formatDate(
      new Date(currentDate.valueOf() - millisecondsInADay)
    );

    handleSetDateButtons(previousDate);

    datepickerInput.val(previousDate);
    datepickerInput.trigger("change");
  });

  nextButton.on("click", function (e) {
    e.preventDefault();
    // set the previous date int he datepicker
    const currentDate = new Date(datepickerInput.val());
    const nextDate = formatDate(
      new Date(currentDate.valueOf() + millisecondsInADay)
    );

    handleSetDateButtons(nextDate);

    datepickerInput.val(nextDate);
    datepickerInput.trigger("change");
  });

  datepickerValueField.on("click", function () {
    // display the datepicker on click
    datepickerInput.get(0).showPicker();
  });

  // update the display field on date input change event
  datepickerInput.on("change", function (e) {
    // show the updated date on the display field
    datepickerValueField.text($(e.currentTarget).val());
  });

  /**
   *
   * @param {Date} dateToCheck
   */
  const handleSetDateButtons = (dateToCheck) => {
    const maxDate = new Date(datepickerInput.prop("max"));
    const minDate = new Date(datepickerInput.prop("min"));
    const shouldDisableNextButton =
      dateToCheck.valueOf + millisecondsInADay >= maxDate.valueOf();
    const shouldDisablePreviousButton =
      dateToCheck.valueOf - millisecondsInADay >= minDate.valueOf();

    nextButton.prop("disabled", shouldDisableNextButton);
    previousButton.prop("disabled", shouldDisablePreviousButton);
  };

  return field;
};
