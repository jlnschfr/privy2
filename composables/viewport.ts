import { useDebounceFn } from "@vueuse/core";

export function useViewport(): { isMobile: Ref<boolean> } {
  const isMobile: Ref<boolean> = ref();

  function handleResize(): void {
    isMobile.value = !window.matchMedia("(min-width: 1024px)").matches;
  }

  const debouncedResize = useDebounceFn(handleResize, 150);

  onMounted(() => {
    window.addEventListener("resize", debouncedResize);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", debouncedResize);
  });

  return { isMobile };
}
