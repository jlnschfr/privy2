<script setup lang="ts">
import { Filter, Tag } from "@/types/enums";

interface Props {
  noteId: string;
}
const props = defineProps<Props>();

const route = useRoute();
const noteStore = useNoteStore();
const snackbarStore = useSnackbarStore();
const note: Ref<Note> = ref(noteStore.get(props.noteId));
const isFavorite: Ref<boolean> = ref(noteStore.get(props.noteId).favorite);

async function remove(): Promise<void> {
  const alreadyTrashed = Boolean(
    note.value?.tags.find((el) => el.text === Tag.Trash),
  );

  if (alreadyTrashed) {
    noteStore.remove(props.noteId);
  } else {
    note.value.tags = [...note.value.tags, { text: Tag.Trash }];
    noteStore.update(props.noteId, { tags: note.value?.tags });
  }

  await nextTick();
  if (route.name === "note-id") {
    navigateTo(`/notes/?filter=${Filter.Favorites}`);
  }

  snackbarStore.show({
    text: "Item deleted",
    action: "undo",
    callback: () => {
      undoRemove(note.value, alreadyTrashed);
    },
  });
}

function undoRemove(deletedNote: Note, alreadyTrashed: boolean): void {
  if (alreadyTrashed) {
    noteStore.add(deletedNote, { redirect: false });
  } else {
    const index = deletedNote.tags.findIndex((el) => el.text === Tag.Trash);
    deletedNote.tags.splice(index, 1);
    noteStore.update(deletedNote.id, deletedNote, { updateEditedAt: false });
  }
}

function toggleFav(): void {
  isFavorite.value = !isFavorite.value;

  noteStore.update(props.noteId, {
    favorite: isFavorite.value,
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
        'text-secondary-500': isFavorite,
      }"
      :disabled="!note"
      @click.stop="toggleFav()"
    >
      <SvgoHeart
        aria-hidden="true"
        class="w-2"
        :class="{
          'fill-current': isFavorite,
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
