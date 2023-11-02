<script setup lang="ts">
import { v4 as uuid } from "uuid";

const noteStore = useNoteStore();
const route = useRoute();

const id: ComputedRef<string> = computed(() => route.params.id as string);
const isNew: ComputedRef<boolean> = computed(() => id.value === "new");

if (isNew.value) {
  await noteStore.add({ id: uuid() });
}

const note: ComputedRef<Note> = computed(() => noteStore.get(id.value));
const items: ComputedRef<Item[]> = computed(() => note.value.items);
const title: Ref<string> = ref(note.value ? note.value.title : "");

watch(title, () => {
  noteStore.update(id.value, { title: title.value });
});

onMounted(() => {
  window.addEventListener("keydown", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyUp);
});

function handleKeyUp(event: KeyboardEvent) {
  const isEnter = event.code === "Enter";
  const isEnterAndShift = event.code === "Enter" && event.shiftKey;

  if (isEnter || isEnterAndShift) {
    const focusEl: Element = document.activeElement;
    const keyUpInBody = focusEl === document.querySelector("body");
    const keyUpInTask = focusEl.closest(".Task");

    if (keyUpInBody) {
      createItem(isEnterAndShift ? "markdown" : "task");
    }

    if (keyUpInTask) {
      const draggableItem: HTMLElement = focusEl.closest(".draggable-item");
      const itemId: string = draggableItem?.dataset.id;
      const itemIndex: number = items.value.findIndex(
        (item) => item.id === itemId,
      );

      createItem(isEnterAndShift ? "markdown" : "task", itemIndex);
    }
  }
}

function getMarkdownTemplate(): Markdown {
  return {
    id: uuid(),
    type: "Markdown",
    data: {
      text: "",
    },
  };
}

function getTaskTemplate(): Task {
  return {
    id: uuid(),
    type: "Task",
    data: {
      text: "",
      isValid: false,
    },
  };
}

function createItem(type: "task" | "markdown", index?: number) {
  const template: Item =
    type === "task" ? getTaskTemplate() : getMarkdownTemplate();
  const itms: Item[] = [...items.value];
  index >= 0 ? itms.splice(index + 1, 0, template) : itms.push(template);

  noteStore.update(id.value, {
    items: [...itms],
  });

  setTimeout(() => {
    focusItem(type, template);
  }, 300);
}

function focusItem(type: "task" | "markdown", item: Item) {
  const itemSelector = `[data-id='${item.id}'] ${
    type === "task" ? "input[type=text]" : ".Markdown"
  }`;

  const itemEl: HTMLInputElement | HTMLTextAreaElement =
    document.querySelector(itemSelector);

  if (!itemEl) return;
  type === "task" ? itemEl.focus() : itemEl.click();
}
</script>

<template>
  <section
    class="mx-auto flex min-h-detail max-w-3xl flex-col justify-between bg-neutral-600 shadow-xl transition duration-300 dark:bg-neutral-100"
  >
    <article>
      <header
        class="flex items-center border-b border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:p-4"
      >
        <Date :date="note.edited_at" />
        <ResponsiveTextarea v-model="title" class="mr-2 flex-auto" />
        <PrivyNoteInteraction :note-id="id" />
      </header>

      <div class="sm:p-4 p-3">
        <PrivyDraggableItems :note-id="id" />
      </div>
    </article>

    <footer
      class="flex flex-col justify-between border-t border-neutral-400 p-3 transition duration-300 dark:border-neutral-200 md:flex-row md:items-end md:p-4"
    >
      <aside class="w-full flex-shrink md:mr-4 md:max-w-tags">
        <PrivyTags :note-id="id" />
      </aside>
      <nav class="mt-6 flex flex-none md:mt-0 md:justify-between">
        <Button class="mr-4" @click="createItem('markdown')"
          >Add Markdown</Button
        >
        <Button @click="createItem('task')">Add Task</Button>
      </nav>
    </footer>
  </section>
</template>
