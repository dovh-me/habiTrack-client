import { RequestHandler } from "../Store.mjs";

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const loginPageHandler = (requestHandler, store, pages) => {
  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    $.mobile.changePage(pages.home, {
      transition: "fade",
    });
  });
};
