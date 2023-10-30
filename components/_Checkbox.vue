<script setup lang="ts">
import { v4 as uuid } from "uuid";

export interface Props {
  modelValue: boolean;
}

defineProps<Props>();
defineEmits(["update:modelValue"]);

const id: Ref<string> = ref(uuid());
</script>

<template>
  <div>
    <input
      :id="id"
      class="visuallyhidden"
      type="checkbox"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <label aria-label="checkbox" :for="id" class="flex items-center pr-2">
      <span
        class="inline-flex h-3 w-3 items-center justify-center border border-neutral-200 dark:border-neutral-400"
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
  transition: all 300ms;
}
</style>
