import { RequestHandler } from "../RequestHandler.js";
import { HabitCard } from "../components/index.js";
import { formatDate } from "../util/formatDate.js";

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const homePageHandler = (requestHandler, store, pages) => {
  // const habitsContainerId = "#habit-cards-container";
  const overlayClass = "show-overlay";
  const datepickerSelector = pages["home"] + " .date-picker-field";

  $("#cancel-create-habit-button").on("click", function (e) {
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

  $(pages.home).on("pagebeforeshow", function (e) {
    // redirect to login page if not authenticated
    if (!requestHandler.isAuthenticated) {
      $.mobile.changePage(pages["login"], {
        transition: "fade",
      });
      return;
    }

    if (store?.user) {
      const name = getName(store?.user?.name);
      $(".welcome-user-text").text(name);
    }

    const datepicker = $(datepickerSelector);

    // set the default datepicker value
    const now = new Date();
    const today = formatDate(now);

    // Set the max date to today
    // TODO : Needs to be handled from the backend as well
    datepicker.prop("max", today);
    datepicker.val(today);
    datepicker.trigger("change");
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
    console.log("datepicker change event triggered", date);

    $(pages["home"]).addClass(overlayClass);
    requestHandler.getAllHabitsWithLogs(date).then(({ habits }) => {
      loadHabitCards(habits, ".habit-cards-container");
      $(pages["home"]).removeClass(overlayClass);
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

  /**
   *
   * @param {any[]} habits
   * @param {string} selector
   */
  function loadHabitCards(habits, selector = ".habit-cards-container") {
    const habitCards = habits.map((habit) => {
      const { log, ...habitTemp } = habit;
      const prepHabit = { ...(log[0] ?? {}), ...habitTemp };
      // prepare the habit object
      return HabitCard(prepHabit, store, pages);
    });

    // Populate the DOM
    $(selector).html(habitCards);
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

/**
 *
 * @param {string} fullName
 * @returns {string}
 */
const getName = (fullName) => {
  const [firstName] = fullName.split(/[\s]+/);
  const capitalizedName =
    firstName.substring(0, 1).toUpperCase() + firstName.substring(1);

  return capitalizedName;
};
