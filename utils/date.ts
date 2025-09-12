export const createDateString = (
  date: string,
  options: Intl.DateTimeFormatOptions,
): string => {
  const timestamp: number = Date.parse(date);
  return !isNaN(timestamp)
    ? new Date(date).toLocaleString("de-DE", options)
    : "";
};
