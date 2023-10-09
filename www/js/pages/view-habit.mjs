import { RequestHandler } from "../RequestHandler.js";
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
      if (isNaN(parsedInput))
        throw new Error("Invalid input. Number required!");

      $(pages.viewHabit).addClass("show-overlay");
      requestHandler
        .sendUpsertHabitLogRequest({
          habitId: habit._id,
          date: formatDate(new Date()),
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
    const habit = store.clickedHabit;

    try {
      $(pages.viewHabit).addClass("show-overlay");
      requestHandler
        .sendUpsertHabitLogRequest({
          habitId: habit._id,
          date: formatDate(new Date()),
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

  $("#view-progress-button").on("click", function (e) {
    e.preventDefault();

    const pageToNavigate = pages["habitSummary"];
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

  function loadFieldValues() {
    const habit = store.clickedHabit;
    console.log("habit within view-habit loadFieldValues", habit);

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
