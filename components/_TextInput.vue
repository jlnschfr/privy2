<script setup lang="ts">
import { v4 as uuid } from "uuid";

interface Props {
  disabled?: boolean;
  modelValue: string;
  placeholder?: string;
  border?: boolean;
  label?: boolean;
}
interface Emits {
  (e: "update:modelValue", value: string): void;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: "Placeholder",
  border: true,
  label: true,
});
const emit = defineEmits<Emits>();

const id: ComputedRef<string> = computed(() => uuid());
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      :class="{
        'translate-y-1/2 opacity-0': !modelValue,
      }"
      class="block transform text-sm text-neutral-200 transition-all dark:text-neutral-300"
    >
      {{ placeholder }}
    </label>
    <input
      :id="id"
      :disabled="disabled"
      class="text-decoration-inherit block w-full appearance-none bg-transparent py-1 leading-normal placeholder-neutral-200 dark:placeholder-neutral-400"
      :class="{
        'border-b border-neutral-200 dark:border-neutral-400': border,
        'cursor-not-allowed': disabled,
      }"
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      autocomplete="off"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<style scoped>
.text-decoration-inherit {
  text-decoration: inherit;
}
</style>
