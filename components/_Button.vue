<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'border-primary-500 bg-primary-500 text-neutral-600 hover:bg-primary-600':
        primary,
      'border-secondary-500 bg-secondary-500 text-neutral-600 hover:bg-secondary-600':
        secondary,
      'border-neutral-200 bg-transparent text-neutral-200 hover:bg-neutral-500 dark:border-neutral-400 dark:text-neutral-600 dark:hover:bg-neutral-200':
        !primary && !secondary,
      'cursor-not-allowed text-opacity-50 dark:text-opacity-50': disabled,
    }"
    class="block border px-2 py-0_5 transition-colors md:px-4"
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
