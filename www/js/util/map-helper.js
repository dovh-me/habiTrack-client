export const getMappedRepetition = (repetition) => {
  const map = {
    weekly: "week",
    yearly: "year",
    daily: "day",
  };
  return map[repetition];
};
