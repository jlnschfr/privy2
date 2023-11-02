<template>
  <div class="relative">
    <StaggeredTransition
      class="mb-6 grid grid-cols-1 items-center gap-4vw pb-4vw md:grid-cols-2 md:pb-0 lg:grid-cols-3 lg:gap-2vw"
    >
      <PrivyNoteTeaser
        v-for="(note, key) in notes"
        :key="key"
        :note="note"
        :data-index="key"
      />
    </StaggeredTransition>
  </div>
</template>

<script>
export default {
  components: {
    PrivyNoteTeaser: () => import("@/components/PrivyNoteTeaser"),
    StaggeredTransition: () => import("@/components/_StaggeredTransition"),
  },

  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
};
</script>
