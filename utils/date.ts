export const createDateString = (date: string, options: any): string => {
  const timestamp: number = Date.parse(date);
  return !isNaN(timestamp)
    ? new Date(date).toLocaleString("de-DE", options)
    : "";
};
