<script setup lang="ts">
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <textarea
    :value="modelValue"
    class="privy-focus h-5 resize-none overflow-hidden bg-transparent text-2xl font-bold"
    placeholder="Title"
    @input="
      $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
    "
  />
</template>

<!-- <script>
import TextareaHeightUpdater from "@/mixins/textarea-height-updater.js";

export default {
  mixins: [TextareaHeightUpdater],
  props: {
    value: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script> -->
