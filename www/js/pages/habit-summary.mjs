import { RequestHandler } from "../RequestHandler.js";
import { FullWidthDatePicker } from "../components/FullWidthDatePicker.js";

/**
 *
 * @param {RequestHandler} requestHandler
 * @param {*} store
 * @param {*} pages
 */
export const habitSummaryPageHandler = (requestHandler, store, pages) => {
  function getPageSelector(...rest) {
    return `${pages["habitSummary"]} ${rest.join(" ")}`;
  }
  const datepickerContainerSelector = getPageSelector(
    ".full-width-datepicker-container"
  );
  const datepickerSelector = getPageSelector(" .date-picker-field");
  let datepickerInput = $(datepickerSelector);
  const overlayClass = "show-overlay";
  const cancelButton = $("#cancel-habit-summary-button");

  const chart = initChart();

  // register navigation buttons
  cancelButton.on("click", function (e) {
    e.preventDefault();

    $.mobile.changePage(pages["home"], {
      transition: "fade",
    });
  });

  // register the datepicker

  $(pages.habitSummary).on("pagebeforeshow", function (e) {
    const habit = store.clickedHabit;
    if (!habit) return;

    const localRepetitionMap = {
      daily: "week",
      weekly: "month",
      monthly: "year",
    };

    $(datepickerContainerSelector)
      .toArray()
      .forEach((field) => {
        FullWidthDatePicker(field, localRepetitionMap[habit.repetition]);
      });

    // re-query for the input field
    datepickerInput = $(datepickerSelector);

    datepickerInput.on("change", function (e) {
      const habit = store.clickedHabit;
      const date = $(e.currentTarget).val();

      requestHandler.getHabitSummary(habit._id, date).then(({ summary }) => {
        loadChart(summary);
        loadFields(summary, habit);
      });
    });
    datepickerInput.val(store.selectedDate);
    datepickerInput.trigger("change");
  });

  function initChart() {
    const chartElement = $(getPageSelector(".chart-container")).get(0);
    return echarts.init(chartElement);
  }

  function loadChart(summary) {
    const habit = store.clickedHabit;

    // send the summary request
    const progressTrend = Array(7).fill(0);
    const green = "#37b400";
    const red = "#f31700";
    summary.forEach((e) => {
      progressTrend[e?.date] = {
        value: e.progress,
        itemStyle: {
          color: e.progress >= habit.goal ? green : red,
        },
      };
    });

    const options = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: progressTrend,
          type: "bar",
        },
      ],
    };
    chart.setOption(options);
  }

  /**
   *
   * @param {string} repetition
   */
  function getSummaryPeriodText(repetition) {
    switch (repetition.toLowerCase()) {
      case "daily":
        return "Weekly";
      case "weekly":
        return "Monthly";
      case "monthly":
        return "Yearly";
      default:
        return "";
    }
  }

  function loadFields(summary, habit) {
    const generatedSummary = generateSummary(summary, habit);

    const summaryTitlePeriodField = $(getPageSelector(".summary-duration"));
    const summaryPeriod = getSummaryPeriodText(habit.repetition);
    summaryTitlePeriodField.text(summaryPeriod);

    const habitNameField = $(getPageSelector(".habit-name"));
    habitNameField.text(habit.name);

    const repetitionField = $(getPageSelector(".repetition"));
    repetitionField.text(generatedSummary.repetition);

    const averageExpectedField = $(getPageSelector(".avg-expected"));
    averageExpectedField.text(generatedSummary.avgExpected);

    const averageProgress = $(getPageSelector(".avg-progress"));
    averageProgress.text(generatedSummary.avgProgress);

    const totalExpectedField = $(getPageSelector(".tot-expected"));
    totalExpectedField.text(generatedSummary.totalExpected);

    const totalProgressField = $(getPageSelector(".tot-progress"));
    totalProgressField.text(generatedSummary.totalProgress);

    const streakField = $(getPageSelector(".streak"));
    streakField.text(generatedSummary.streak);
  }

  function generateSummary(summary, habit) {
    const repetitionMap = {
      daily: 7,
      weekly: 4,
      monthly: 12,
    };

    const repetition = repetitionMap[habit.repetition];
    const totalExpected = habit.goal * repetition;
    const totalProgress = summary.reduce((prev, e) => prev + e.progress, 0);
    const avgExpected = Math.round(totalExpected / repetition);
    const avgProgress = Math.round(totalProgress / repetition);
    const streak = "N/A";

    return {
      repetition: habit.repetition,
      totalExpected,
      totalProgress,
      avgExpected,
      avgProgress,
      streak,
    };
  }
};
