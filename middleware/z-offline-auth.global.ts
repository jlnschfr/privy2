export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;
  if (to.path !== "/") return;
  if (navigator?.onLine) return;

  const hasLocalNotes = Object.keys(localStorage).some(
    (key) => key.startsWith("notes-") && localStorage.getItem(key) !== "[]",
  );

  if (hasLocalNotes) {
    return abortNavigation();
  }
});
