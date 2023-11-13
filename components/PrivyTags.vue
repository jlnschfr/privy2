<script setup lang="ts">
interface Props {
  noteId: string;
}
const props = defineProps<Props>();

const noteStore = useNoteStore();

const tags: ComputedRef<Tag[]> = computed(
  () => noteStore.get(props.noteId)?.tags,
);
const input: Ref<string> = ref("");

function addTag() {
  if (input.value && !tags.value?.find((tag) => tag.text === input.value)) {
    noteStore.update(props.noteId, {
      tags: [...tags.value, { text: input.value }],
    });
    input.value = "";
  }
}
function removeTag(text: string) {
  const index = tags.value?.findIndex((tag) => tag.text === text);

  if (index >= 0) {
    const newTags = [...tags.value];
    newTags.splice(index, 1);
    noteStore.update(props.noteId, {
      tags: newTags,
    });
  }
}
</script>

<template>
  <div>
    <ul class="flex flex-wrap">
      <li
        v-for="(tag, key) in tags"
        :key="key"
        class="mr-1 mt-1 flex items-center justify-center rounded-full bg-primary-500 px-2 py-0_5 text-neutral-600"
      >
        {{ tag.text }}
        <button
          aria-label="remove tag"
          class="privy-focus-white ml-1 inline"
          @click="removeTag(tag.text)"
        >
          <SvgoCross class="w-2 fill-current" />
        </button>
      </li>
    </ul>
    <TextInput
      v-model="input"
      class="mt-1"
      placeholder="Your Tag"
      type="text"
      :disabled="noteId === 'new'"
      @keydown.enter="addTag"
    />
  </div>
</template>
