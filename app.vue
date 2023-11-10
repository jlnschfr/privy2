<script setup lang="ts">
const user = useSupabaseUser();
const noteStore = useNoteStore();

if (user.value) {
  await noteStore.fetchAll();
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
