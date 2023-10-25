<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'bg-primary-500 border-primary-500 hover:bg-primary-600 text-neutral-600':
        primary,
      'bg-secondary-500 border-secondary-500 hover:bg-secondary-600 text-neutral-600':
        secondary,
      'bg-transparent hover:bg-neutral-500 dark:hover:bg-neutral-200 text-neutral-200 dark:text-neutral-600 border-neutral-200 dark:border-neutral-400':
        !primary && !secondary,
      'text-opacity-50 dark:text-opacity-50 cursor-not-allowed': disabled,
    }"
    class="border block px-2 md:px-4 py-0_5 transition-colors"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
export interface Props {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

defineEmits(["click"]);

withDefaults(defineProps<Props>(), {
  type: "button",
  disabled: false,
  primary: false,
  secondary: false,
});
</script>
