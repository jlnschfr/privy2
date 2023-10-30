<script setup lang="ts">
const timeout: Ref<any> = ref();
const activeElement: Ref<HTMLElement> = ref();
const button = ref(null);

const snackbarStore = useSnackbarStore();
const snackbar: ComputedRef<Snackbar> = computed(() => snackbarStore.snackbar);
const callback: ComputedRef<Function> = computed(() => snackbar.value.callback);
const text: ComputedRef<string> = computed(() => snackbar.value.text);
const action: ComputedRef<string> = computed(() => snackbar.value.action);
const isActive: ComputedRef<boolean> = computed(() => snackbarStore.isActive);

watch(isActive, async () => {
  if (isActive.value) {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }

    await nextTick();
    activeElement.value = document.activeElement as HTMLElement;
    button.value.focus();

    timeout.value = setTimeout(() => {
      snackbarStore.hide();
    }, 8000);
  } else if (timeout.value) {
    clearTimeout(timeout.value);
  }
});

function undo() {
  callback.value();
  snackbarStore.hide();

  if (activeElement.value) {
    activeElement.value.focus();
    activeElement.value = null;
  }
}
</script>

<template>
  <transition v-if="isActive" name="fade">
    <div
      class="fixed bottom-2vw left-50 flex min-w-snackbar -translate-x-1/2 transform items-center justify-between bg-neutral-200 px-3 py-2 shadow-lg md:left-app"
    >
      <p class="flex-auto text-neutral-600">{{ text }}</p>
      <button
        ref="button"
        class="ml-5 font-bold text-secondary-500"
        @click="undo"
      >
        {{ action }}
      </button>
    </div>
  </transition>
</template>
