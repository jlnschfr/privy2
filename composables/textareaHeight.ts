import { useDebounceFn } from "@vueuse/core";

export function useTextareaHeight(textArea: Ref<HTMLTextAreaElement>): {
  updateTextareaHeight: () => void;
} {
  function updateTextareaHeight(): void {
    if (textArea.value) {
      if (textArea.value?.clientHeight < textArea.value?.scrollHeight) {
        textArea.value.style.height = textArea.value?.scrollHeight + "px";
      }
    }
  }

  const debouncedResize = useDebounceFn(updateTextareaHeight, 500);

  onMounted(() => {
    window.addEventListener("resize", debouncedResize);
    updateTextareaHeight();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", debouncedResize);
  });

  return { updateTextareaHeight };
}
