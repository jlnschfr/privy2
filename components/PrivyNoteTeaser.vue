<script setup lang="ts">
interface Props {
  noteId: string;
}
const props = defineProps<Props>();

const noteStore = useNoteStore();
const queryParams = useQueryParams();
const { activeTag } = queryParams;

const note: ComputedRef<Note> = computed(() => noteStore.get(props.noteId));
const tasks: ComputedRef<Task[]> = computed(
  () => note.value?.items.filter((item) => item.type === "Task") as Task[],
);
const doneTasks: ComputedRef<Task[]> = computed(
  () => tasks.value?.filter((item) => item.data?.isValid),
);

function open(id: string) {
  let tag: string = "";

  if (activeTag.value) {
    tag = activeTag.value;
  } else if (note.value?.tags.length) {
    tag = note.value?.tags[0].text;
  }

  navigateTo(`/note/${id}/?tag=${tag}`);
}
</script>

<template>
  <article
    class="privy-focus cursor-pointer bg-neutral-600 shadow-lg duration-300 dark:bg-neutral-100"
    tabindex="0"
    @keyup.enter="open(note.id)"
    @click="open(note.id)"
  >
    <div
      class="sm:p-4 flex p-3"
      :class="{
        'items-center': !tasks.length,
        'items-end': tasks.length,
      }"
    >
      <Date :date="note.edited_at" />

      <div>
        <h2 class="w-full hyphens-auto text-2xl font-bold leading-none">
          {{ note.title }}
        </h2>
        <p v-if="tasks.length" class="mt-0_5 flex gap-1">
          <span>{{ tasks.length }} tasks</span>
          <span>{{ doneTasks.length }} done</span>
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center">
        <p
          v-for="(noteTag, key) in note.tags.slice(0, 1)"
          :key="key"
          class="mr-1 flex items-center justify-center rounded-full bg-primary-500 px-2 py-0_5 text-neutral-600"
        >
          {{ noteTag.text }}
        </p>
        <p v-if="note.tags.length > 1">+{{ note.tags.length - 1 }}</p>
      </div>
      <PrivyNoteInteraction :note-id="note.id" />
    </div>
  </article>
</template>
