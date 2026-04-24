<script setup lang="ts">
import { createEmptyNote } from "@/utils/note";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const noteStore = useNoteStore();

const id: ComputedRef<string> = computed(() => route.params.id as string);
const isNew: ComputedRef<boolean> = computed(() => id.value === "new");

if (isNew.value) {
  const emptyNote = createEmptyNote();
  noteStore.add(emptyNote, { redirect: true });
}
</script>

<template>
  <PrivyNoteDetail v-if="!isNew" :note-id="id" />
</template>
