<script setup lang="ts">
import debounce from "lodash.debounce";

interface Props {
  modelValue: string[];
  validator?: Function;
}
interface Emits {
  (e: "update:modelValue", items: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  validator: () => true,
});
const emit = defineEmits<Emits>();

const items: Ref<string[]> = ref(props.modelValue);
const input: Ref<string> = ref("");

watch(
  () => items.value.length,
  debounce(() => {
    emit("update:modelValue", items.value);
  }, 250),
);

function onClick() {
  if (
    input.value === "" ||
    items.value.includes(input.value) ||
    !props.validator(input.value)
  )
    return;
  items.value.push(input.value);
  input.value = "";
}
</script>

<template>
  <div>
    <ul>
      <li v-for="(item, index) in items" :key="index" class="mt-1 italic">
        {{ item }}
      </li>
    </ul>
    <TextInput
      v-model="input"
      class="mt-3"
      placeholder="RSS Feed Url"
      @keydown.enter.prevent="onClick"
    />
  </div>
</template>
