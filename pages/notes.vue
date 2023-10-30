<script setup lang="ts">
const noteStore = useNoteStore();

const notes = computed(() => {
  return noteStore.notes.filter(
    (note) => !note.tags.find((tag) => tag.text === "trash"),
  );
});

const trashedNotes = computed(() => {
  return noteStore.notes.filter((note) =>
    note.tags.find((tag) => tag.text === "trash"),
  );
});
</script>

<template>
  <div>
    <h1>Your notes</h1>

    <ul v-if="notes?.length > 0">
      <li v-for="note of notes" :key="note.id">
        <NuxtLink :to="`/note/${note.id}`">{{ note.title }}</NuxtLink>
      </li>
    </ul>

    <h1 class="mt-2">Your trashed notes</h1>

    <ul v-if="trashedNotes?.length > 0">
      <li v-for="note of trashedNotes" :key="note.id">
        <NuxtLink :to="`/note/${note.id}`">{{ note.title }}</NuxtLink>
      </li>
    </ul>

    <Button @click="navigateTo('/note/new')">add note</Button>
  </div>
</template>
