<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'dark-hover:bg-primary-600 border-primary-500 bg-primary-500 text-neutral-600 hover:bg-primary-600 dark:border-primary-500':
        primary,
      'dark-hover:bg-secondary-600 border-secondary-500 bg-secondary-500 text-neutral-600 hover:bg-secondary-600 dark:border-secondary-500':
        secondary,
      'cursor-not-allowed text-opacity-50 dark:text-opacity-50': disabled,
    }"
    class="dark-hover:bg-neutral-200 privy-focus block border border-neutral-200 bg-transparent px-2 py-0_5 text-neutral-200 hover:bg-neutral-500 dark:border-neutral-400 dark:text-neutral-600 md:px-4"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "button",
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    primary: {
      type: Boolean,
      default: false,
      required: false,
    },
    secondary: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
};
</script>
