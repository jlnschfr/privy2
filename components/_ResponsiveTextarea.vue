<script setup lang="ts">
import debounce from "lodash.debounce";
import { useTextareaHeight } from "@/composables/textareaHeight";

interface Props {
  modelValue: string;
}
interface Emits {
  (e: "update:modelValue", value: string): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const textarea: Ref<HTMLTextAreaElement> = ref(null);
const { updateTextareaHeight } = useTextareaHeight(textarea);

const onInput = debounce((e) => {
  updateTextareaHeight();

  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}, 500);

onMounted(() => {
  if (props.modelValue === "") {
    setTimeout(() => {
      textarea.value.focus();
    }, 500);
  }
});
</script>

<template>
  <textarea
    ref="textarea"
    :value="modelValue"
    class="privy-focus h-5 resize-none overflow-hidden bg-transparent text-2xl font-bold"
    placeholder="Title"
    autocomplete="false"
    @input="onInput"
  />
</template>
