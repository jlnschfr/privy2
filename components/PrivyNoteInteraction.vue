<script setup lang="ts">
export interface Props {
  noteId: string;
}

const props = defineProps<Props>();

const route = useRoute();
const noteStore = useNoteStore();
const note: ComputedRef<Note> = computed(() => noteStore.getNote(props.noteId));

console.log(note.value);

function remove() {
  const alreadyTrashed = note.value.tags.find(
    (el) => el.text.toLowerCase() === "trash",
  );

  if (alreadyTrashed) {
    noteStore.deleteNote(props.noteId);
  } else {
    const tags = [...note.value.tags, { text: "trash" }];
    noteStore.updateNote(props.noteId, { tags });
  }

  if (route.name === "note-id") {
    navigateTo("/notes");
  }
}

// this.$store.dispatch("showSnackbar", {
//   text: "Item deleted",
//   action: "undo",
//   callback: () => {
//     this.undoRemove(note, alreadyTrashed);
//   },
// });

// function undoRemove(note, alreadyTrashed) {
//     if (alreadyTrashed) {
//       this.$store.dispatch("addNote", note);
//     } else {
//       const index = note.tags.findIndex((el) => el.text === "Trash");
//       note.tags.splice(index, 1);
//       this.$store.dispatch("updateNote", note);
//     }
//   },

function toggleFav() {
  noteStore.updateNote(props.noteId, {
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
      @click="toggleFav()"
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
      @click="remove()"
    >
      <SvgoTrash aria-hidden="true" class="fill w-2"
    /></IconButton>
  </div>
</template>
