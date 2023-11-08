<script setup lang="ts">
interface Props {
  noteId: string;
}

const props = defineProps<Props>();

const route = useRoute();
const noteStore = useNoteStore();
const snackbarStore = useSnackbarStore();

const note: ComputedRef<Note> = computed(() => noteStore.get(props.noteId));

function remove() {
  const alreadyTrashed = Boolean(
    note.value.tags.find((el) => el.text.toLowerCase() === "trash"),
  );

  if (alreadyTrashed) {
    noteStore.remove(props.noteId);
  } else {
    const tags = [...note.value.tags, { text: "trash" }];
    noteStore.update(props.noteId, { tags });
  }

  if (route.name === "note-id") {
    navigateTo("/notes");
  }

  snackbarStore.show({
    text: "Item deleted",
    action: "undo",
    callback: () => {
      undoRemove(note.value, alreadyTrashed);
    },
  });
}

function undoRemove(note: Note, alreadyTrashed: boolean) {
  if (alreadyTrashed) {
    noteStore.add(note);
  } else {
    const index = note.tags.findIndex((el) => el.text === "Trash");
    note.tags.splice(index, 1);
    noteStore.update(note.id, note);
  }
}

function toggleFav() {
  noteStore.update(props.noteId, {
    favorite: !note.value.favorite,
    edited_at: new Date().toISOString(),
  });
}
</script>

<template>
  <div class="flex items-center">
    <IconButton
      label="add note to favorites"
      class="mr-2"
      :class="{
        'text-secondary-500': note?.favorite,
      }"
      :disabled="!note"
      @click.stop="toggleFav()"
    >
      <SvgoHeart
        aria-hidden="true"
        class="w-2"
        :class="{
          'fill-current': note?.favorite,
        }"
      />
    </IconButton>
    <IconButton
      label="delete note"
      styling="secondary"
      :disabled="!note"
      @click.stop="remove()"
    >
      <SvgoTrash aria-hidden="true" class="fill w-2"
    /></IconButton>
  </div>
</template>
