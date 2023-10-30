<script setup lang="ts">
const noteStore = useNoteStore();
</script>

<template>
  <div>
    <h1>Your notes</h1>

    <ul v-if="noteStore.notes?.length > 0">
      <li v-for="note of noteStore.notes" :key="note.id">
        <NuxtLink :to="`/note/${note.id}`">{{ note.title }}</NuxtLink>
      </li>
    </ul>

    <Button @click="navigateTo('/note/new')">add note</Button>
  </div>
</template>
