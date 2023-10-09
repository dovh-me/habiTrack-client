import { formatDate } from "../util/formatDate.js";

export const FullWidthDatePicker = (field, step = "day") => {
  const inputClass = "date-picker-field";
  const valueDisplayClass = "date-display";
  const previousButtonClass = "previous-date";
  const nextButtonClass = "next-date";

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
  const steps = {
    day: {
      previousStep: (date) => dayjs(date).subtract(1, "day").valueOf(),
      nextStep: (date) => dayjs(date).add(1, "day").valueOf(),
      getValue: (date) => {
        const parsedDate = dayjs(date);
        return `${formatDate(parsedDate.toDate())}`;
      },
    },
    week: {
      previousStep: (date) =>
        dayjs(date).startOf("week").subtract(1, "week").valueOf(),
      nextStep: (date) => dayjs(date).startOf("week").add(1, "week").valueOf(),
      getValue: (date) => {
        const parsedDate = dayjs(date);
        return `${formatDate(
          parsedDate.startOf("week").toDate()
        )} - ${formatDate(parsedDate.endOf("week").toDate())}`;
      },
    },
    month: {
      previousStep: (date) =>
        dayjs(date).startOf("month").subtract(1, "month").valueOf(),
      nextStep: (date) =>
        dayjs(date).startOf("month").add(1, "month").valueOf(),
      getValue: (date) => {
        const parsedDate = dayjs(date);
        return `${formatDate(
          parsedDate.startOf("month").toDate()
        )} - ${formatDate(parsedDate.endOf("month").toDate())}`;
      },
    },
    year: {
      previousStep: (date) =>
        dayjs(date).startOf("year").subtract(1, "year").valueOf(),
      nextStep: (date) => dayjs(date).startOf("year").add(1, "year").valueOf(),
      getValue: (date) => {
        const parsedDate = dayjs(date);
        return `${formatDate(
          parsedDate.startOf("year").toDate()
        )} - ${formatDate(parsedDate.endOf("year").toDate())}`;
      },
    },
  };
  const currentStep = steps[step];

  previousButton.on("click", function (e) {
    e.preventDefault();
    // set the previous date int he datepicker
    const currentDate = new Date(datepickerInput.val());
    const previousDate = formatDate(
      new Date(currentStep.previousStep(currentDate))
    );

    handleSetDateButtons(previousDate);

    datepickerInput.val(previousDate);
    datepickerInput.trigger("change");
  });

  nextButton.on("click", function (e) {
    e.preventDefault();
    // set the previous date int he datepicker
    const currentDate = new Date(datepickerInput.val());
    const nextDate = formatDate(new Date(currentStep.nextStep(currentDate)));

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
    datepickerValueField.text(currentStep.getValue(datepickerInput.val()));
  });

  /**
   *
   * @param {Date} dateToCheck
   */
  const handleSetDateButtons = (dateToCheck) => {
    const maxDate = new Date(datepickerInput.prop("max"));
    const minDate = new Date(datepickerInput.prop("min"));
    const shouldDisableNextButton =
      currentStep.nextStep(dateToCheck) >= maxDate.valueOf();
    const shouldDisablePreviousButton =
      currentStep.previousStep(dateToCheck) <= minDate.valueOf();

    nextButton.prop("disabled", shouldDisableNextButton);
    previousButton.prop("disabled", shouldDisablePreviousButton);
  };

  return field;
};
