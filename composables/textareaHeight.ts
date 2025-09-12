import debounce from "lodash.debounce";

export function useTextareaHeight(textArea: Ref<HTMLTextAreaElement>): {
  updateTextareaHeight: () => void;
} {
  const resizeHandler: Ref<ReturnType<typeof debounce> | undefined> = ref();

  function updateTextareaHeight(): void {
    if (textArea.value) {
      if (textArea.value?.clientHeight < textArea.value?.scrollHeight) {
        textArea.value.style.height = textArea.value?.scrollHeight + "px";
      }
    }
  }

  onMounted(() => {
    resizeHandler.value = debounce(updateTextareaHeight, 500);
    window.addEventListener("resize", resizeHandler.value);
    updateTextareaHeight();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler.value);
  });

  return { updateTextareaHeight };
}
