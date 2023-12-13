export const isValidUrl = (urlString: string): Boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
