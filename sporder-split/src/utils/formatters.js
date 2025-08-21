// src/utils/formatters.js

export const fmtTime = (d) =>
  new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);

export const fmtDay = (d) =>
  new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);