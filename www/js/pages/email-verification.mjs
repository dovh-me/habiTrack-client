import { RequestHandler } from "../Store.mjs";
import {
  segmentedInputHandler,
  getValueFromSegmentedInputs,
} from "../util/segmentedInput.js";

/**
 *
 * @param {RequestHandler} requestHandler
 */
export const emailVerificationPageHandler = (requestHandler) => {
  $("#email-verification-form").on("submit", function (e) {
    e.preventDefault();
    const code = getValueFromSegmentedInputs(
      e,
      ".verification-input-group input"
    );
    console.log("Verification code entered", code);
  });
  segmentedInputHandler(".verification-input-group input");
};
