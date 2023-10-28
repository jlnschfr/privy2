<!-- <script setup lang="ts">
export interface Props {
  isFavorite: boolean;
  tags: string;
}

withDefaults(defineProps<Props>(), {
  type: "button",
  disabled: false,
});
</script> -->

<template>
  <div class="flex items-center">
    <IconButton
      label="add note to favorites"
      class="mr-2 hover:bg-neutral-500 dark:hover:bg-neutral-200"
      :class="{
        'text-secondary-500': false,
      }"
      @click="toggleFav(note)"
    >
      <SvgoHeart
        aria-hidden="true"
        class="w-2"
        :class="{
          'fill-current': false,
        }"
      />
    </IconButton>
    <IconButton
      label="delete note"
      class="bg-primary-500 text-neutral-600 hover:bg-primary-600"
      @click="remove(note)"
    >
      <SvgoTrash aria-hidden="true" class="fill w-2"
    /></IconButton>
  </div>
</template>

<!-- <script>
export default {
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },

  methods: {
    remove(note) {
      const alreadyTrashed = this.note.tags.find((el) => el.text === "Trash");

      if (alreadyTrashed) {
        this.$store.dispatch("deleteNote", note);
      } else {
        note.tags.push({ text: "Trash" });
        this.$store.dispatch("updateNote", note);
      }

      if (this.currentRoute === "note") {
        this.$router.push(`/notes/`);
      }

      this.$store.dispatch("showSnackbar", {
        text: "Item deleted",
        action: "undo",
        callback: () => {
          this.undoRemove(note, alreadyTrashed);
        },
      });
    },

    undoRemove(note, alreadyTrashed) {
      if (alreadyTrashed) {
        this.$store.dispatch("addNote", note);
      } else {
        const index = note.tags.findIndex((el) => el.text === "Trash");
        note.tags.splice(index, 1);
        this.$store.dispatch("updateNote", note);
      }
    },

    toggleFav(note) {
      const data = {
        ...note,
        isFav: !this.note.isFav,
      };

      data.createdDate = new Date().toISOString();
      this.$store.dispatch("updateNote", data);
    },
  },
};
</script> -->
