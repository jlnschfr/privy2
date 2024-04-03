import { ifvisible } from "@rosskevin/ifvisible";

let idleInterval: NodeJS.Timeout;

const isElementActive = (): Boolean => {
  return (
    document.activeElement.tagName.toUpperCase() === "INPUT" ||
    document.activeElement.tagName.toUpperCase() === "TEXTAREA"
  );
};

export const initIdleFetch = (callback: Function) => {
  ifvisible.setIdleDuration(5);
  ifvisible.on("idle", async () => {
    if (isElementActive()) return;

    await callback();

    idleInterval = setInterval(async () => {
      await callback();
    }, 15000);
  });

  ifvisible.on("wakeup", () => {
    clearInterval(idleInterval);
  });
};
