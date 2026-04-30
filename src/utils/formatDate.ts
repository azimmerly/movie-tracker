const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatDate = (date: Date | string) =>
  dateFormat.format(new Date(date));
