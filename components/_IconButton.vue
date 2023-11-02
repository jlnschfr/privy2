<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  label: string;
  styling?: "primary" | "secondary";
  secondary?: boolean;
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
    :aria-label="label"
    :class="{
      'border-neutral-200 bg-transparent hover:bg-neutral-500 dark:border-neutral-400 dark:hover:bg-neutral-200':
        styling === 'primary',
      'bg-primary-500 text-neutral-600 hover:bg-primary-600':
        styling === 'secondary',
      'cursor-not-allowed': disabled,
    }"
    class="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
  >
    <slot />
  </button>
</template>
