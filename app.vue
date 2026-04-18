<script setup lang="ts">
import { initIdleFetch } from "@/utils/idleFetch";

const user = useSupabaseUser();
const noteStore = useNoteStore();
const locationStore = useLocationStore();
const weatherStore = useWeatherStore();
const rssStore = useRssStore();

await nextTick();

watchEffect(async () => {
  if (user.value) {
    await locationStore.init();
    await weatherStore.init();

    if (navigator?.onLine) {
      await noteStore.fetchAll();
      await rssStore.fetchAll();
    }
  }
});

window.addEventListener("online", async () => {
  await noteStore.syncLocalToServer();
  await noteStore.fetchAll();
  await rssStore.fetchAll();
});

initIdleFetch(async () => {
  if (!navigator?.onLine) return;
  await noteStore.fetchAll();
  await rssStore.fetchAll();
});
</script>

<template>
  <NuxtLayout>
    <VitePwaManifest />
    <h1 class="visually-hidden">Privy Notes</h1>
    <NuxtPage />
  </NuxtLayout>
</template>
