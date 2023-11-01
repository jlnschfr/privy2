<script setup lang="ts">
import { v4 as uuid } from "uuid";

const noteStore = useNoteStore();
const route = useRoute();

const id: ComputedRef<string> = computed(() => route.params.id as string);
const isNew: ComputedRef<boolean> = computed(() => id.value === "new");

if (isNew.value) {
  await noteStore.add({ id: uuid() });
}

const note: ComputedRef<Note> = computed(() => noteStore.get(id.value));
const items: ComputedRef<Items> = computed(() => note.value.items);
const title: Ref<string> = ref("");

function createMarkdown() {
  const item: Markdown = {
    id: uuid(),
    type: "Markdown",
    data: {
      text: "",
    },
  };

  noteStore.update(id.value, {
    items: [...items.value, item],
  });
}

function createTask() {
  const item: Task = {
    id: uuid(),
    type: "Task",
    data: {
      text: "",
      isValid: false,
    },
  };

  noteStore.update(id.value, {
    items: [...items.value, item],
  });
}

watch(title, () => {
  noteStore.update(id.value, { title: title.value });
});
</script>

<template>
  <section
    class="mx-auto flex min-h-detail max-w-3xl flex-col justify-between bg-neutral-600 shadow-xl transition duration-300 dark:bg-neutral-100"
  >
    <article>
      <header
        class="flex items-center border-b border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:p-4"
      >
        <Date :date="note.edited_at" />
        <ResponsiveTextarea v-model="title" class="mr-2 flex-auto" />
        <PrivyNoteInteraction :note-id="id" />
      </header>

      <div>
        <p><NuxtLink to="/notes">All Notes</NuxtLink></p>
      </div>

      <div class="sm:p-4 p-3">
        <PrivyDraggableItems :note-id="id" />
      </div>
    </article>

    <footer
      class="flex flex-col justify-between border-t border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:flex-row md:items-end md:p-4"
    >
      <aside class="w-full flex-shrink md:mr-4 md:max-w-tags">
        <PrivyTags :note-id="id" />
      </aside>
      <nav class="mt-6 flex flex-none md:mt-0 md:justify-between">
        <Button class="mr-4" @click="createMarkdown">Add Markdown</Button>
        <Button @click="createTask">Add Task</Button>
      </nav>
    </footer>
  </section>
</template>
