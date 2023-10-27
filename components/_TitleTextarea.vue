<script setup lang="ts">
import debounce from "lodash.debounce";
import { useTitleHeight } from "./../composables/titleHeight";

export interface Props {
  modelValue: string;
}

defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const textarea: Ref<any> = ref(null);
const { updateTextareaHeight } = useTitleHeight(textarea);

const handleInput = debounce((e) => {
  updateTextareaHeight();
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}, 500);
</script>

<template>
  <textarea
    ref="textarea"
    :value="modelValue"
    class="h-5 resize-none overflow-hidden bg-transparent text-2xl font-bold"
    placeholder="Title"
    @input="handleInput"
  />
</template>
