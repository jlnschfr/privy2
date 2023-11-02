<template>
  <article
    class="PrivyNoteTeaser privy-focus cursor-pointer bg-neutral-600 shadow-lg transition duration-300 dark:bg-neutral-100"
    tabindex="0"
    @keyup.enter="open(note.id)"
    @click="open(note.id)"
  >
    <div
      class="sm:p-4 flex p-3"
      :class="{ 'items-center': !tasks.length, 'items-end': tasks.length }"
    >
      <PrivyDate :date="note.createdDate" />

      <div>
        <h2 class="w-full hyphens-auto text-2xl font-bold leading-none">
          {{ note.title }}
        </h2>
        <p v-if="tasks.length" class="mt-0_5">
          <span>{{ tasks.length }} tasks</span>
          <span>{{ done.length }} done</span>
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center">
        <p
          v-for="(noteTag, key) in note.tags.slice(0, 1)"
          :key="key"
          class="mr-1 flex items-center justify-center rounded-full bg-primary-500 px-2 py-0_5 text-neutral-600"
        >
          {{ noteTag.text }}
        </p>
        <p v-if="note.tags.length > 1">+{{ note.tags.length - 1 }}</p>
      </div>
      <PrivyNoteInteraction :note="note" />
    </div>
  </article>
</template>

<script>
import { first } from "@/utils/array";

export default {
  components: {
    PrivyDate: () => import("@/components/PrivyDate"),
    PrivyNoteInteraction: () => import("@/components/PrivyNoteInteraction"),
  },

  props: {
    note: {
      type: Object,
      required: true,
    },
  },

  computed: {
    tasks() {
      return this.note.items.filter((item) => {
        return item.type === "Task";
      });
    },
    done() {
      return this.tasks.filter((item) => {
        return item.data && item.data.state;
      });
    },
  },

  methods: {
    open(id) {
      let tag = "";

      if (this.$route.query.tag) {
        tag = this.$route.query.tag;
      } else if (first(this.note.tags)) {
        tag = first(this.note.tags).text;
      }

      this.$router.push(`/note/?id=${id}&tag=${tag}`);
    },
  },
};
</script>

<style scoped>
.hyphens-auto {
  hyphens: auto;
}
</style>
