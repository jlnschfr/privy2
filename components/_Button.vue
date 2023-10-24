<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'bg-primary-500 text-neutral-600 border-primary-500 dark:border-primary-500 hover:bg-primary-600 dark-hover:bg-primary-600': primary,
      'bg-secondary-500 text-neutral-600 border-secondary-500 dark:border-secondary-500 hover:bg-secondary-600 dark-hover:bg-secondary-600': secondary,
      'text-opacity-50 dark:text-opacity-50 cursor-not-allowed': disabled,
    }"
    class="bg-transparent hover:bg-neutral-500 dark-hover:bg-neutral-200 text-neutral-200 dark:text-neutral-600 border-neutral-200 dark:border-neutral-400 border block px-2 md:px-4 py-0_5 privy-focus"
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
      default: 'button',
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
}
</script>
