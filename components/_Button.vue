<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  styling?: "primary" | "secondary" | "tertiary";
}

withDefaults(defineProps<Props>(), {
  type: "button",
  disabled: false,
  styling: "primary",
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'border-neutral-200 bg-transparent text-neutral-200 hover:bg-neutral-500 dark:border-neutral-400 dark:text-neutral-600 dark:hover:bg-neutral-200':
        styling === 'primary',
      'border-primary-500 bg-primary-500 text-neutral-600 hover:bg-primary-600':
        styling === 'secondary',
      'border-secondary-500 bg-secondary-500 text-neutral-600 hover:bg-secondary-600':
        styling === 'tertiary',
      'cursor-not-allowed text-opacity-50 dark:text-opacity-50': disabled,
    }"
    class="block border px-2 py-0_5 transition-colors md:px-4"
  >
    <slot />
  </button>
</template>
