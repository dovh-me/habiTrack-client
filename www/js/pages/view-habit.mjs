import { RequestHandler } from "../RequestHandler.js";
import { AlertEntry } from "../components/AlertEntry.js";
import { formatDate } from "../util/formatDate.js";

/**
 *
 * @param {RequestHandler} requestHandler
 * @param {*} store
 * @param {*} pages
 */
export const viewHabitPageHandler = (requestHandler, store, pages) => {
  const datepickerSelector = pages["viewHabit"] + " .date-picker-field";
  const datepickerInput = $(datepickerSelector);
  const overlayClass = "show-overlay";

  $(pages.viewHabit).on("pagebeforeshow", function (e) {
    // redirect to login page if not authenticated
    if (!requestHandler.isAuthenticated) {
      $.mobile.changePage(pages["login"], {
        transition: "fade",
      });
      return;
    }

    if (!store?.clickedHabit) {
      $.mobile.changePage(pages.home, {
        transition: "slide",
      });
    }

    datepickerInput.val(store.selectedDate);
    datepickerInput.trigger("change");

    // populate the alerts section
    updateAlerts();
  });

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  $("#update-progress-button").on("click", function (e) {
    e.preventDefault();

    if (!store?.clickedHabit) {
      $.mobile.changePage(pages.home, {
        transition: "slide",
      });
    }
    const habit = store.clickedHabit;

    const userInput = prompt(
      "Please enter new progress of the habit. Make sure to only enter numbers.",
      `${habit.progress ?? 0}`
    );
    if (!userInput) return; // returns prematurely if user cancels the prompt

    try {
      const parsedInput = +userInput;
      const date = datepickerInput.val();

      if (isNaN(parsedInput))
        throw new Error("Invalid input. Number required!");

      $(pages.viewHabit).addClass("show-overlay");
      requestHandler
        .sendUpsertHabitLogRequest({
          habitId: habit._id,
          date: date,
          progress: parsedInput,
        })
        .then((result) => {
          $(pages.viewHabit).removeClass("show-overlay");
          store.clickedHabit = {
            ...store.clickedHabit,
            log: result.resultMessage.habitLog,
          };
          loadFieldValues();
          // show the success alert
          alert(
            `Result: ${result?.resultMessage?.en}\nCode: ${result.resultCode}`
          );
        });
    } catch (error) {
      console.error("There was an error updating the habit progress", error);
      alert(
        "Error: There was an error updating the habit log! Please check your input values."
      );
    } finally {
      $(pages.viewHabit).removeClass("show-overlay");
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

  $("#complete-progress-button").on("click", function (e) {
    e.preventDefault();

    if (!store?.clickedHabit) {
      $.mobile.changePage(pages.home, {
        transition: "slide",
      });
    }
    const date = datepickerInput.val();
    const habit = store.clickedHabit;

    try {
      $(pages.viewHabit).addClass("show-overlay");
      requestHandler
        .sendUpsertHabitLogRequest({
          habitId: habit._id,
          date: date,
          progress: habit.goal,
        })
        .then((result) => {
          $(pages.viewHabit).removeClass("show-overlay");
          store.clickedHabit = {
            ...store.clickedHabit,
            log: result.resultMessage.habitLog,
          };
          loadFieldValues();
          // show the success alert
          alert(
            `Result: ${result?.resultMessage?.en}\nCode: ${result.resultCode}`
          );
        });
    } catch (error) {
      const message = "There was an error completing the progress";
      console.error(message, error);
      alert(message);
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

  $("#notes-edit-button").on("click", function (e) {
    e.preventDefault();

    if (!store?.clickedHabit) {
      $.mobile.changePage(pages.home, {
        transition: "slide",
      });
    }
    const habit = store.clickedHabit;

    const userInput = prompt(
      "Add/Edit your notes. Any string characters are allowed within notes. No character limit for now.",
      `${habit.notes ?? ""}`
    );

    if (!userInput) return; // returns prematurely if user cancels the prompt

    try {
      $(pages.viewHabit).addClass("show-overlay");
      requestHandler
        .sendUpsertHabitLogRequest({
          habitId: habit._id,
          date: formatDate(new Date()),
          notes: userInput,
        })
        .then((result) => {
          $(pages.viewHabit).removeClass("show-overlay");
          store.clickedHabit = {
            ...store.clickedHabit,
            log: result.resultMessage.habitLog,
          };
          loadFieldValues();
          // show the success alert
          alert(
            `Result: ${result?.resultMessage?.en}\nCode: ${result.resultCode}`
          );
        });
    } catch (error) {
      console.error("There was an error updating the habit progress", error);
      alert(
        "Error: There was an error updating the habit log! Please check your input values."
      );
    } finally {
      $(pages.viewHabit).removeClass("show-overlay");
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

  $("#cancel-view-habit-button").on("click", function (e) {
    e.preventDefault();

    const pageToNavigate = pages.home;
    $.mobile.changePage(pageToNavigate, {
      transition: "fade",
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

  $(datepickerSelector).on("change", function (e) {
    const date = $(e.currentTarget).val();
    const habit = store.clickedHabit;

    if (!habit) {
      console.error(
        "No habit is selected. Navigating to the home page as this should not be possible"
      );
      $.mobile.changePage(pages["home"], {
        transition: "fade",
      });
      return;
    }

    $(pages["viewHabit"]).addClass(overlayClass);
    requestHandler.getHabitWithLog(date, habit._id).then(({ habit }) => {
      const { logs = [], ...rest } = habit;

      store.clickedHabit = { log: logs?.[0] ?? {}, ...rest };
      loadFieldValues();

      $(pages["viewHabit"]).removeClass(overlayClass);
      store.selectedDate = date;
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

  $("#edit-habit-page-button").on("click", function (e) {
    e.preventDefault();

    const pageToNavigate = pages["editHabit"];
    $.mobile.changePage(pageToNavigate, {
      transition: "fade",
    });
  });

  $("#view-progress-button").on("click", function (e) {
    e.preventDefault();

    const pageToNavigate = pages["habitSummary"];
    $.mobile.changePage(pageToNavigate, {
      transition: "fade",
    });
  });

  // Load the alerts
  const createAlertPopup = $("#create-alert-dialog");
  const addAlertButton = $("#alerts-add-button");
  const cancelSubmitAlert = $("#cancel-alert-submit");
  const submitCreateAlert = $("#create-alert-submit");
  const alertTimeInput = $("#alert-time-input");
  addAlertButton.on("click", function (e) {
    e.preventDefault();

    createAlertPopup.popup("open");
  });

  submitCreateAlert.on("click", function (e) {
    e.preventDefault();

    // close the popup
    createAlertPopup.popup("close");

    // get the input value
    const [hours, minutes] = alertTimeInput?.val()?.split(":");

    if (!hours || !minutes || !store.clickedHabit) return;

    console.log("hours", hours, "minutes", minutes);
    const timeObj = {
      hour: hours,
      minute: minutes,
    };

    // send create alert request
    requestHandler
      .sendCreateAlertRequest(timeObj, store.clickedHabit._id)
      .then((result) => {
        // don't execute any further if the resultCode is different from what is expected
        if (result.resultCode !== "00180") return;

        // reset the input
        alertTimeInput.val("");
        store.notificationHandler.schedule(result.data);
        alert("Successfully created the habit alert!");
        createAlertPopup.popup("close");
      })
      .catch((error) => {
        const message = "There was an error creating the alert!";
        alert(message);
        console.error(message, error);
      });
  });

  cancelSubmitAlert.on("click", function (e) {
    e.preventDefault();

    createAlertPopup.popup("close");
  });

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  function updateAlerts() {
    // remove all the previously added alert entries
    $(".alert-entry").remove();

    // get the habit alerts with the habitId
    if (!store?.clickedHabit) return;

    const habit = store.clickedHabit;
    const alertContainer = $("#alert-entries");
    const noAlertsPrompt = alertContainer.find("#no-alerts-prompt");

    console.log("sending alerts request");
    requestHandler
      .getHabitAlerts(habit._id)
      .then((result) => {
        if (result.resultCode !== "00240") return;

        const noAlertsDisplay = result?.data?.length > 0 ? "none" : "block";
        noAlertsPrompt.css("display", noAlertsDisplay);

        (result?.data ?? []).forEach((item) => {
          return AlertEntry(item, requestHandler, store, alertContainer);
        });
      })
      .catch((error) => {
        const message = "There was an error retrieving habit alerts";
        alert(message);
        console.log(message, error);
      });
  }

  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------
  //----------------

  function loadFieldValues() {
    const habit = store.clickedHabit;

    // set the title field value
    const pageTitle = $(pages.viewHabit + " .header-text");
    pageTitle.text(habit.name);

    // load the other relevant fields
    const statusField = $(pages.viewHabit + " .status");
    const isHabitDone = habit.log.isDone; // this is a property available in the log. Verify the property exists
    statusField.text(isHabitDone ? "Done" : "Not Done");
    statusField
      .removeClass("done not-done")
      .addClass(isHabitDone ? "done" : "not-done");

    const progressField = $(pages.viewHabit + " .progress");
    progressField.text(
      `${habit.log.progress ?? 0} ${habit.goalUnits ?? "Unknown"}`
    );

    const goalField = $(pages.viewHabit + " .goal");
    goalField.text(`${habit.goal ?? 0} ${habit.goalUnits ?? "Unknown"}`);

    const repetitionField = $(pages.viewHabit + " .repeats");
    repetitionField.text(habit.repetition ?? "Unknown");

    const notesField = $(pages.viewHabit + " .notes-section .notes-content");
    const hasNotes = habit.log.notes ?? false;
    notesField.removeClass("gray-out");
    if (!hasNotes) {
      notesField.addClass("gray-out");
    }
    notesField.text(
      hasNotes
        ? habit.log.notes
        : "No notes yet. Use the edit button to add notes."
    );

    // disable the complete progress button if the habit log is marked as done
    const completeProgressButtonStatus = habit.log.progress >= habit.goal;

    const completeProgressButton = $("#complete-progress-button");
    completeProgressButton.prop("disabled", completeProgressButtonStatus);
  }
};
