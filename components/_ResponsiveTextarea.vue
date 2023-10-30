<script setup lang="ts">
import debounce from "lodash.debounce";
import { useTextareaHeight } from "@/composables/textareaHeight";

export interface Props {
  modelValue: string;
}

defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const textarea: Ref<HTMLTextAreaElement> = ref(null);
const { updateTextareaHeight } = useTextareaHeight(textarea);

const onInput = debounce((e) => {
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
    @input="onInput"
  />
</template>
