<script setup lang="ts">
import { useGetNote } from "@/composables/supabase/getNote";
import { useCreateNote } from "@/composables/supabase/createNote";
import { useUpdateNote } from "@/composables/supabase/updateNote";
import { useDeleteNote } from "@/composables/supabase/deleteNote";

const route = useRoute();
const title: Ref<string> = ref("");
const date: Ref<string> = ref(new Date().toString());
const id: Ref<string> = ref(route.params.id as string);
const isEmpty: ComputedRef<boolean> = computed(() => id.value === "new");

function createNote() {
  if (isEmpty.value) {
    useCreateNote({ title: title.value, favorite: false });
  }
}

function updateTitle() {
  useUpdateNote(id.value, {
    title: title.value,
    edited_at: new Date().toString(),
  });
}

function deleteNote() {
  useDeleteNote(id.value);
}

if (isEmpty.value) {
  watch(title, createNote);
  // handle also other initial changes (tabs, tasks, ...)
} else {
  const note: Ref<Note> = await useGetNote(id.value);
  title.value = note.value.title;
  date.value = note.value.edited_at;
  watch(title, updateTitle);
  // watch other parts
}

function createMarkdown() {
  console.log("click");
}

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
        <PrivyDate :date="date" />
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
