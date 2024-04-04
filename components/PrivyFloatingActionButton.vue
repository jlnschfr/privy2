<script setup lang="ts">
interface Props {
  isActive: boolean;
}

defineProps<Props>();

const queryParams = useQueryParams();
const snackbarStore = useSnackbarStore();
const noteStore = useNoteStore();

const isTrashRoute = computed(() => {
  const { activeTag } = queryParams;
  return activeTag.value.toLocaleLowerCase() === "trash";
});

function clearTrash() {
  snackbarStore.show({
    text: "Clearing trash can't be undone. Are you sure?",
    action: "continue",
    callback: () => {
      noteStore.notesTrashed.forEach(async ({ id }) => {
        await noteStore.remove(id);
      });
    },
  });
}
</script>

<template>
  <FloatingActionButton
    v-if="!isTrashRoute"
    redirect="/note/new"
    label="Add a new note"
    tabindex="0"
    :is-active="isActive"
  >
    <SvgoPlus class="w-3 fill-current" />
  </FloatingActionButton>
  <FloatingActionButton
    v-else
    label="Clear trash"
    tabindex="0"
    :is-active="isActive"
    @click="clearTrash"
  >
    <SvgoTrash class="w-3" />
  </FloatingActionButton>
</template>
