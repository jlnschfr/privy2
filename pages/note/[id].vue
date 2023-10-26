<script setup>
import debounce from "lodash.debounce";
import { useGetNote } from "./../composables/supabase/getNote.js";
import { useAddNote } from "./../composables/supabase/addNote.js";
import { useUpdateNote } from "./../composables/supabase/updateNote.js";
import { useDeleteNote } from "./../composables/supabase/deleteNote.js";

const route = useRoute();

const title = ref("");
const id = ref(route.params.id);
const isEmpty = computed(() => id.value === "new");

const addNote = debounce(() => {
  if (isEmpty.value) {
    useAddNote({ title: title.value });
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
</script>

<template>
  <div>
    <NuxtLink to="/notes">All Notes</NuxtLink>
    <span>Note ID: {{ $route.params.id }}</span>
    <input v-model="title" placeholder="new todo" />
    <Button @click="deleteNote">Delete</Button>
  </div>
</template>
