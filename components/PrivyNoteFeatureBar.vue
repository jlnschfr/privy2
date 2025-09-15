<script setup lang="ts">
interface Props {
  noteId: string;
}
const props = defineProps<Props>();
</script>

<template>
  <aside class="flex items-center justify-end">
    <PrivyRecipeButton :note-id="props.noteId" />
  </aside>
</template>
