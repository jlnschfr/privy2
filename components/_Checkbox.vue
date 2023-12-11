<script setup lang="ts">
import { v4 as uuid } from "uuid";

interface Props {
  modelValue: boolean;
}
interface Emits {
  (e: "update:modelValue", isChecked: boolean): void;
}
defineProps<Props>();
const emit = defineEmits<Emits>();

const id: Ref<string> = ref(uuid());
</script>

<template>
  <div>
    <input
      :id="id"
      :value="modelValue"
      class="visually-hidden"
      type="checkbox"
      @input="emit('update:modelValue', !modelValue)"
    />
    <label aria-label="checkbox" :for="id" class="flex items-center pr-2">
      <span
        class="transition-borderColor inline-flex h-3 w-3 items-center justify-center border border-neutral-200 duration-300 dark:border-neutral-400"
        ><SvgoCheck v-if="modelValue" class="w-2" />
      </span>
    </label>
  </div>
</template>

<style>
input:focus + label span {
  box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  outline: none;
}
</style>
