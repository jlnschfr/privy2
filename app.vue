<script setup lang="ts">
const user = useSupabaseUser();
const noteStore = useNoteStore();
const rssStore = useRssStore();

if (user.value) {
  if (navigator?.onLine) {
    await noteStore.fetchAll();
    await rssStore.fetchAll();
  }
}
</script>

<template>
  <NuxtLayout>
    <VitePwaManifest />
    <h1 class="visually-hidden">Privy Notes</h1>
    <NuxtPage />
  </NuxtLayout>
</template>
