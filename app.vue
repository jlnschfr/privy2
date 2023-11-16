<script setup lang="ts">
const user = useSupabaseUser();
const noteStore = useNoteStore();

if (user.value) {
  if (navigator?.onLine) {
    await noteStore.fetchAll();
  }
}
</script>

<template>
  <NuxtLayout>
    <VitePwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>
