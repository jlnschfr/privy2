<script setup lang="ts">
const noteStore = useNoteStore();
const queryParams = useQueryParams();

const { activeTag } = queryParams;
const notes: ComputedRef<Note[]> = computed(() =>
  noteStore.getFiltered(activeTag.value),
);
</script>

<template>
  <div class="relative">
    <div
      class="mb-6 grid grid-cols-1 items-center gap-4vw pb-4vw md:grid-cols-2 md:pb-0 lg:grid-cols-3 lg:gap-2vw"
    >
      <PrivyNoteTeaser
        v-for="(note, key) in notes"
        :key="key"
        :note="note"
        :data-index="key"
      />
    </div>
  </div>
</template>
