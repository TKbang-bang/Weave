const { format, subSeconds } = require("date-fns");
const { subDays } = require("date-fns/subDays");
const { subHours } = require("date-fns/subHours");
const { subMinutes } = require("date-fns/subMinutes");
const { subMonths } = require("date-fns/subMonths");
const { subWeeks } = require("date-fns/subWeeks");
const { subYears } = require("date-fns/subYears");

// const todayFormatted = format(today, dateFormat);

const myDate = (date, today, dateFormat) => {
  const filters = [
    {
      label: "A moment ago",
      startAt: format(subSeconds(today, 1), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 minute ago",
      startAt: format(subSeconds(today, 59), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "5 minutes ago",
      startAt: format(subMinutes(today, 4.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "10 minutes ago",
      startAt: format(subMinutes(today, 9.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "15 minutes ago",
      startAt: format(subMinutes(today, 14.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "30 minutes ago",
      startAt: format(subMinutes(today, 29.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "45 minutes ago",
      startAt: format(subMinutes(today, 44.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 hour ago",
      startAt: format(subMinutes(today, 59), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "2 hours ago",
      startAt: format(subHours(today, 1.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "3 hours ago",
      startAt: format(subHours(today, 2.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "4 hours ago",
      startAt: format(subHours(today, 3.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "5 hours ago",
      startAt: format(subHours(today, 4.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },

    {
      label: "more than 5 hours ago",
      startAt: format(subHours(today, 5), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "10 hours ago",
      startAt: format(subHours(today, 9.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },

    {
      label: "more than 10 hours ago",
      startAt: format(subHours(today, 10), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "more than 15 hours ago",
      startAt: format(subHours(today, 15), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 day ago",
      startAt: format(subHours(today, 24), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "2 days ago",
      startAt: format(subDays(today, 1.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "3 days ago",
      startAt: format(subDays(today, 2.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "4 days ago",
      startAt: format(subDays(today, 3.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "5 days ago",
      startAt: format(subDays(today, 4.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "6 days ago",
      startAt: format(subDays(today, 5.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 week ago",
      startAt: format(subDays(today, 7), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "2 weeks ago",
      startAt: format(subDays(today, 14), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "3 weeks ago",
      startAt: format(subDays(today, 21), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "4 weeks ago",
      startAt: format(subDays(today, 28), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 month ago",
      startAt: format(subMonths(today, 1), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "2 months ago",
      startAt: format(subMonths(today, 1.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "3 months ago",
      startAt: format(subMonths(today, 2.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "4 months ago",
      startAt: format(subMonths(today, 3.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "5 months ago",
      startAt: format(subMonths(today, 4.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "6 months ago",
      startAt: format(subMonths(today, 5.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "7 months ago",
      startAt: format(subMonths(today, 6.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "8 months ago",
      startAt: format(subMonths(today, 7.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "9 months ago",
      startAt: format(subMonths(today, 8.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "10 months ago",
      startAt: format(subMonths(today, 9.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "11 months ago",
      startAt: format(subMonths(today, 10.9), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
    {
      label: "1 year ago",
      startAt: format(subMonths(today, 12), "yyyy-MM-dd HH:mm:ss"),
      endAt: format(date, dateFormat),
    },
  ];

  return filters.find((filter) => {
    return filter.startAt <= filter.endAt;
  }).label;
};

module.exports = myDate;
