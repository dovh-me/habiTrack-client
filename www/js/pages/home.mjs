import { RequestHandler } from "../RequestHandler.js";
import { HabitCard } from "../components/index.js";

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const homePageHandler = (requestHandler, store, pages) => {
  const habitsContainerId = "#";

  $(pages.home).on("pagebeforeshow", function (e) {
    if (store?.user) {
      const name = getName(store?.user?.name);
      $(".welcome-user-text").text(name);
    }

    const datepicker = $("#home-habit-datepicker");
    console.log("datepicker", datepicker);
    // set the default datepicker value
    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const today = now.getFullYear() + "-" + month + "-" + day;

    // get all the habits of the user for the today's date
    requestHandler.getAllHabitsWithLogs(today).then(({ habits }) => {
      loadHabitCards(habits, ".habit-cards-container");
    });
  });

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
