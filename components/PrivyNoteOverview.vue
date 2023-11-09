<script setup lang="ts">
const noteStore = useNoteStore();
const queryParams = useQueryParams();

const { activeTag } = queryParams;

const notes: ComputedRef<Note[]> = computed(() =>
  noteStore.getFiltered(activeTag.value),
);

function getDelay(index: number): string {
  return index < 6 ? `${index * 25}ms` : `${6 * 25}ms`;
}
</script>

<template>
  <div class="relative">
    <TransitionGroup
      tag="div"
      name="staggered-transition"
      mode="out-in"
      class="mb-6 grid grid-cols-1 items-center gap-4vw pb-4vw md:grid-cols-2 md:pb-0 lg:grid-cols-3 lg:gap-2vw"
    >
      <PrivyNoteTeaser
        v-for="(note, key) in notes"
        :key="note.id + Math.random()"
        :note-id="note.id"
        :style="{ transitionDelay: getDelay(key) }"
      />
    </TransitionGroup>
  </div>
</template>

<style>
.staggered-transition-enter-active,
.staggered-transition-leave-active {
  transition: all 300ms ease;
}
.staggered-transition-enter-from,
.staggered-transition-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
