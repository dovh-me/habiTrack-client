/**
 * Enables autofocus, copy paste like functionalities for segmented inputs fields
 * This is a code that was extracted from the internet
 * [link](https://codepen.io/RobertAron/pen/gOLLXLo).
 * All rights received by the respective author
 * @param {string} selector
 */
export function segmentedInputHandler(selector = "input.code-input") {
  const inputElements = [...document.querySelectorAll(selector)];
  console.log("Got the input elements", inputElements);

  inputElements.forEach((ele, index) => {
    ele.addEventListener("keydown", (e) => {
      // if the keycode is backspace & the current field is empty
      // focus the input before the current. Then the event happens
      // which will clear the "before" input box.
      if (e.keyCode === 8 && e.target.value === "")
        inputElements[Math.max(0, index - 1)].focus();
    });
    ele.addEventListener("input", (e) => {
      // take the first character of the input
      // this actually breaks if you input an emoji like 👨‍👩‍👧‍👦....
      // but I'm willing to overlook insane security code practices.
      const [first, ...rest] = e.target.value;
      e.target.value = first ?? ""; // first will be undefined when backspace was entered, so set the input to ""
      const lastInputBox = index === inputElements.length - 1;
      const didInsertContent = first !== undefined;
      if (didInsertContent && !lastInputBox) {
        // continue to input the rest of the string
        inputElements[index + 1].focus();
        inputElements[index + 1].value = rest.join("");
        inputElements[index + 1].dispatchEvent(new Event("input"));
      }
    });
  });
}

/**
 * Submit handler to extract the data from the segmented input fields
 * @param {Event} e
 * @param {string} selector Selector for the input fields
 */
export function getValueFromSegmentedInputs(e, selector = "input.code-input") {
  const inputElements = [...document.querySelectorAll(selector)];
  const code = inputElements.map(({ value }) => value).join("");
  return code;
}
