<script setup lang="ts">
const user = useSupabaseUser();
const noteStore = useNoteStore();

if (user.value) {
  await noteStore.fetchAll();
}
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
