export const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};
