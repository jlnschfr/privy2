<script setup lang="ts">
import { createEmptyNote } from "@/utils/note";

const route = useRoute();
const noteStore = useNoteStore();

const id: ComputedRef<string> = computed(() => route.params.id as string);
const isNew: ComputedRef<boolean> = computed(() => id.value === "new");

if (isNew.value) {
  const emptyNote = createEmptyNote();
  await noteStore.add(emptyNote, { redirect: true });
}
</script>

<template>
  <PrivyNoteDetail :note-id="id" />
</template>
