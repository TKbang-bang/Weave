const { intervalToDuration } = require("date-fns");

const myDate = (date) => {
  const now = new Date();
  const duration = intervalToDuration({ start: date, end: now });

  const { years, months, weeks, days, hours, minutes, seconds } = duration;

  if (years) return `${years} ${years === 1 ? "year" : "years"} ago`;
  if (months) return `${months} ${months === 1 ? "month" : "months"} ago`;
  if (weeks) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  if (days) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (hours) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (minutes) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  return "A moment ago";
};

module.exports = myDate;
