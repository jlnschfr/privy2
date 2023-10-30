<script setup lang="ts">
const noteStore = useNoteStore();
await noteStore.fetchNotes();
</script>

<template>
  <div
    class="min-h-screen bg-neutral-500 font-body font-normal text-neutral-200 transition duration-300 dark:bg-neutral-50 dark:text-neutral-400"
  >
    <AppHeader />
    <NuxtPage />
    <Snackbar />
  </div>
</template>
