export const HabitCard = (habit, store, pages) => {
  const { name, color, goal, goalUnits, log } = habit;
  const { progress, isDone } = log;
  const statusImages = {
    wontDo: "img/status-wont-do.png",
    noProgress: "img/status-no-progress.png",
    done: "img/status-done.png",
  };

  const statusClass = isDone ? "status done" : "status not-done";
  const statusText = isDone ? "Done" : "Not Done";

  const el = $(`
        <article tabindex="0" class="habit-card">
            <section class="habit-details">
              <div class="title-section">
                <div class="habit-color-elem" style="background-color: ${
                  color ?? "#A2A2A2"
                }"></div>
                <h3 class="habit-name">${name ?? "--"}</h3>
              </div>
              <div class="${statusClass}">${statusText}</div>
              <div class="habit-summary">
                <div class="habit-goal summary-item">
                  <span class="summary-label">Goal: </span>
                  <span class="goal-value">${goal ?? "--"}</span>
                  <span class="goal-unit">${goalUnits ?? "--"}</span>
                </div>
                <div class="habit-progress summary-item">
                  <span class="summary-label">Progress: </span>
                  <span class="goal-value">${progress ?? "--"}</span>
                  <span class="goal-unit">${goalUnits ?? "--"}</span>
                </div>
              </div>
            </section>
            <section class="habit-status-icon">
              <img
                src="${
                  isDone ? statusImages["done"] : statusImages["noProgress"]
                }"
                alt="no progress"
                width="40"
                height="40"
              />
            </section>
          </article>
    `);
  el.on("click", function () {
    store.clickedHabit = habit;
    $.mobile.changePage(pages.viewHabit, {
      transition: "fade",
    });
  });
  return el;
};
