<script setup lang="ts">
export interface Props {
  modelValue: Task;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const text: Ref<string> = ref(props.modelValue.text);
const isValid: Ref<boolean> = ref(props.modelValue.isValid);

watchEffect(() => {
  emit("update:modelValue", {
    data: { text: text.value, isValid: isValid.value },
  });
});
</script>

<template>
  <div class="Task flex items-center">
    <Checkbox v-model="isValid" />
    <TextInput
      v-model="text"
      :label="false"
      :border="false"
      :class="{ 'line-through': isValid }"
      class="new-task-on-enter"
      type="text"
    />
  </div>
</template>
