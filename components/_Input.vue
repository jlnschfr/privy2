<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      :class="{
        'opacity-0 translate-y-1/2': !value,
      }"
      class="transform block transition-all text-sm text-neutral-200 dark:text-neutral-300"
    >
      {{ placeholder }}
    </label>
    <input
      :id="id"
      class="text-decoration-inherit bg-transparent placeholder-neutral-200 dark:placeholder-neutral-400 w-full block appearance-none leading-normal py-1 privy-focus"
      :class="{
        'border-b border-neutral-200 dark:border-neutral-400': border,
      }"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      autocomplete="off"
      @input="$emit('input', $event.target.value)"
      @keydown.enter="$emit('enter', $event.target.value)"
      @focus="$emit('focus')"
    />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: "text",
    },
    value: {
      type: String,
      required: false,
      default: "",
    },
    placeholder: {
      type: String,
      required: false,
      default: "Placeholder",
    },
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
    label: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    id() {
      return "test";
    },
  },
};
</script>

<style scoped>
.text-decoration-inherit {
  text-decoration: inherit;
}
</style>
