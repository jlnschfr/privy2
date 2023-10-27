<script setup>
import debounce from "lodash.debounce";
import { useGetNote } from "./../composables/supabase/getNote";
import { useAddNote } from "./../composables/supabase/addNote";
import { useUpdateNote } from "./../composables/supabase/updateNote";
import { useDeleteNote } from "./../composables/supabase/deleteNote";

const route = useRoute();

const title = ref("");
const id = ref(route.params.id);
const isEmpty = computed(() => id.value === "new");

const addNote = debounce(() => {
  if (isEmpty.value) {
    useAddNote({ title: title.value, favorite: false });
  }
}, 500);

function updateTitle() {
  useUpdateNote(id.value, { title: title.value });
}

function deleteNote() {
  useDeleteNote(id.value);
}

if (isEmpty.value) {
  watch(title, addNote);
  // handle also other changes (tabs, tasks, ...)
} else {
  const { note } = await useGetNote(id.value);
  title.value = note.value.title;
  watch(title, updateTitle);
}

function createMarkdown() {}

function createTask() {}
</script>

<template>
  <section
    class="mx-auto flex min-h-detail max-w-3xl flex-col justify-between bg-neutral-600 shadow-xl transition duration-300 dark:bg-neutral-100"
  >
    <article>
      <header
        class="flex items-center border-b border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:p-4"
      >
        <!-- <PrivyDate :date="note.createdDate" /> -->
        <TitleTextarea v-model="title" class="mr-2 flex-auto" />
        <!-- <PrivyNoteInteraction :note="note" /> -->
      </header>

      <div>
        <NuxtLink to="/notes">All Notes</NuxtLink>
        <span>Note ID: {{ $route.params.id }}</span>
        <!-- <textarea v-model="title" placeholder="new todo"></textarea> -->
        <Button @click="deleteNote">Delete</Button>
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
