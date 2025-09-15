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

const id: Ref<string> = ref(uuid());
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
      class="privy-focus block w-full appearance-none bg-transparent py-1 leading-normal placeholder-neutral-200 transition-borderColor duration-300 dark:placeholder-neutral-400"
      :class="{
        'border-b border-neutral-200 dark:border-neutral-400': border,
        'cursor-not-allowed': disabled,
        '-mt-2': !modelValue,
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
input {
  text-decoration: inherit;
}
</style>
