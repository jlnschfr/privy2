import { ifvisible } from "@rosskevin/ifvisible";

let idleInterval: NodeJS.Timeout;
const initialTimeout = 10; // in seconds
const repeatingTimeout = 40000; // in milliseconds

const isElementActive = (): boolean => {
  return (
    document.activeElement.tagName.toUpperCase() === "INPUT" ||
    document.activeElement.tagName.toUpperCase() === "TEXTAREA"
  );
};

export const initIdleFetch = (callback: () => Promise<void>) => {
  ifvisible.setIdleDuration(initialTimeout);
  ifvisible.on("idle", async () => {
    if (isElementActive()) return;

    await callback();

    idleInterval = setInterval(async () => {
      await callback();
    }, repeatingTimeout);
  });

  ifvisible.on("wakeup", () => {
    clearInterval(idleInterval);
  });
};
