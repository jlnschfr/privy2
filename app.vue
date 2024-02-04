<script setup lang="ts">
const user = useSupabaseUser();
const noteStore = useNoteStore();
const locationStore = useLocationStore();

if (user.value) {
  await locationStore.init();

  if (navigator?.onLine) {
    await noteStore.fetchAll();
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
