<script setup lang="ts">
const noteStore = useNoteStore();
const queryParams = useQueryParams();

const { activeTag, activeFilter } = queryParams;

const notes: ComputedRef<Note[]> = computed(() => {
  if (activeFilter.value) {
    return noteStore.getNotesByFilter(activeFilter.value);
  } else if (activeTag.value) {
    return noteStore.getNotesByTag(activeTag.value);
  } else {
    return noteStore.notes;
  }
});
</script>

<template>
  <div class="relative">
    <div
      class="mb-6 grid grid-cols-1 items-center gap-4vw pb-4vw md:grid-cols-2 md:pb-0 lg:grid-cols-3 lg:gap-2vw"
    >
      <PrivyNoteTeaser
        v-for="note in notes"
        :key="note.id + Math.random()"
        :note-id="note.id"
      />
    </div>
  </div>
</template>
