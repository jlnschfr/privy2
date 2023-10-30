<script setup lang="ts">
import { useNoteStore } from "@/stores/NoteStore";

const noteStore = useNoteStore();
const route = useRoute();
const title: Ref<string> = ref("");
const date: Ref<string> = ref(new Date().toISOString());
const id: Ref<string> = ref(route.params.id as string);
const isEmpty: ComputedRef<boolean> = computed(() => id.value === "new");

function addNote() {
  if (isEmpty.value) {
    noteStore.addNote({ title: title.value, favorite: false });
  }
}

function updateDate() {
  date.value = new Date().toISOString();
}

function updateTitle() {
  updateDate();

  noteStore.updateNote(id.value, {
    title: title.value,
    edited_at: date.value,
  });
}

function createMarkdown() {}

function createTask() {}

if (isEmpty.value) {
  watch(title, addNote);
  // handle also other initial changes (tabs, tasks, ...)
} else {
  const note: Note = noteStore.getNote(id.value);

  title.value = note.title;
  date.value = note.edited_at;

  watch(title, updateTitle);
  // watch other parts
}
</script>

<template>
  <section
    class="mx-auto flex min-h-detail max-w-3xl flex-col justify-between bg-neutral-600 shadow-xl transition duration-300 dark:bg-neutral-100"
  >
    <article>
      <header
        class="flex items-center border-b border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:p-4"
      >
        <PrivyDate :date="date" />
        <TitleTextarea v-model="title" class="mr-2 flex-auto" />
        <PrivyNoteInteraction :note-id="id" />
      </header>

      <div>
        <p><NuxtLink to="/notes">All Notes</NuxtLink></p>
      </div>

      <div class="sm:p-4 p-3">
        <!-- <PrivyDraggableItems :items="items" @changed="items = $event" /> -->
      </div>
    </article>

    <footer
      class="flex flex-col justify-between border-t border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:flex-row md:items-end md:p-4"
    >
      <aside class="w-full flex-shrink md:mr-4 md:max-w-tags">
        <!-- <Tags :tags="tags" @changed="tags = $event" /> -->
      </aside>
      <nav class="mt-6 flex flex-none md:mt-0 md:justify-between">
        <Button class="mr-4" @click="createMarkdown"> Add Markdown </Button>
        <Button @click="createTask">Add Task</Button>
      </nav>
    </footer>
  </section>
</template>
