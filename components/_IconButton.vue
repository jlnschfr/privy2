<script setup lang="ts">
export interface Props {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  label: string;
}

withDefaults(defineProps<Props>(), {
  type: "button",
  disabled: false,
});
</script>

<template>
  <button
    :aria-label="label"
    :type="type"
    class="flex h-4 w-4 items-center justify-center rounded-full border border-neutral-200 bg-transparent dark:border-neutral-400"
  >
    <slot />
  </button>
</template>
