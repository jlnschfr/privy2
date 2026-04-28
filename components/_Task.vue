<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

interface Props {
  modelValue: Task;
}
interface Emits {
  (e: "update:modelValue", task: Task): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const text: Ref<string> = ref(props.modelValue.data.text);
const isValid: Ref<boolean> = ref(props.modelValue.data.isValid);

watch(
  [text, isValid],
  useDebounceFn(() => {
    emit("update:modelValue", {
      ...props.modelValue,
      data: { text: text.value, isValid: isValid.value },
    });
  }, 250),
);
</script>

<template>
  <div class="Task flex items-center">
    <Checkbox v-model="isValid" />
    <TextInput
      v-model="text"
      :label="false"
      :border="false"
      :class="{ 'line-through': isValid }"
      type="text"
    />
  </div>
</template>
