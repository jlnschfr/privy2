<script setup lang="ts">
import { useGetNotes } from "@/composables/supabase/getNotes";
const notes: Ref<Note[]> = await useGetNotes();
</script>

<template>
  <div>
    <h1>Your notes</h1>

    <ul v-if="notes?.length > 0">
      <li v-for="note of notes" :key="note.id">
        <NuxtLink :to="`/note/${note.id}`">{{ note.title }}</NuxtLink>
      </li>
    </ul>

    <Button @click="navigateTo('/note/new')">add note</Button>
  </div>
</template>
