import debounce from "lodash.debounce";

export function useViewport(): { isMobile: Ref<boolean> } {
  const resizeHandler: Ref<ReturnType<typeof debounce> | undefined> = ref();
  const isMobile: Ref<boolean> = ref();

  function handleResize(): void {
    isMobile.value = !window.matchMedia("(min-width: 1024px)").matches;
  }

  onMounted(() => {
    resizeHandler.value = debounce(handleResize, 150);
    window.addEventListener("resize", resizeHandler.value);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler.value);
  });

  return { isMobile };
}
