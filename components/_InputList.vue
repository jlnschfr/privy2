<script setup lang="ts">
import debounce from "lodash.debounce";

interface Props {
  modelValue: string[];
  validator?: (value: string) => boolean;
}
interface Emits {
  (e: "update:modelValue", items: string[]): void;
  (e: "invalid-input", message: string): void;
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

function onSubmit(): void {
  if (items.value.includes(input.value)) {
    emit("invalid-input", "List item already exist");
  }

  if (!props.validator(input.value)) {
    emit("invalid-input", "Invalid list item");
  }

  if (
    input.value === "" ||
    items.value.includes(input.value) ||
    !props.validator(input.value)
  )
    return;
  items.value.push(input.value);
  input.value = "";
}

function onRemoveClick(index: number): void {
  items.value = items.value.toSpliced(index, 1);
}
</script>

<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        class="mt-1 flex items-center justify-between"
      >
        <p class="w-3/4 truncate italic">{{ item }}</p>
        <button
          type="button"
          aria-label="remove rss feed"
          @click="onRemoveClick(index)"
        >
          <SvgoCross class="w-2 fill-current" />
        </button>
      </li>
    </ul>
    <TextInput
      v-model="input"
      class="mt-3"
      placeholder="RSS Feed Url"
      @keydown.enter.prevent="onSubmit"
    />
  </div>
</template>
