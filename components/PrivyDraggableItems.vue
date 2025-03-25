<script setup lang="ts">
import draggable from "vuedraggable";
import isEqual from "lodash.isequal";

interface Props {
  noteId: string;
}
const props = defineProps<Props>();

const noteStore = useNoteStore();

const items: Ref<Item[]> = ref(
  props.noteId !== "new" ? [...noteStore.get(props.noteId).items] : [],
);

const storeItems: ComputedRef<Item[]> = computed(
  () => noteStore.get(props.noteId)?.items,
);

watch(
  items,
  () => {
    if (!isEqual(storeItems.value, items.value)) {
      noteStore.update(props.noteId, {
        items: [...items.value],
      });

      sortItems();
    }
  },
  { deep: true },
);

watch(storeItems, () => {
  if (!isEqual(storeItems.value, items.value)) {
    items.value = [...storeItems.value];

    sortItems();
  }
});

const snackbarStore = useSnackbarStore();

function onItemDelete(id: string) {
  const itemsBackup = [...items.value];
  const index = items.value?.findIndex((item) => item.id === id);
  items.value?.splice(index, 1);

  snackbarStore.show({
    text: "Item deleted",
    action: "undo",
    callback: () => {
      undoRemove(itemsBackup);
    },
  });
}

function undoRemove(oldItems: Item[]) {
  items.value = oldItems;
}

function getComponent(name: string) {
  const MarkdownComponent = resolveComponent("Markdown");
  const TaskComponent = resolveComponent("Task");

  if (name.toLowerCase() === "task") {
    return TaskComponent;
  } else if (name.toLowerCase() === "markdown") {
    return MarkdownComponent;
  }
}

function sortItems() {
  items.value?.sort((a, b) => {
    const aValid = "isValid" in a.data ? a.data.isValid : false;
    const bValid = "isValid" in b.data ? b.data.isValid : false;

    if (aValid && !bValid) {
      return 1;
    } else if ((aValid && bValid) || (!aValid && !bValid)) {
      return 0;
    } else if (!aValid && bValid) {
      return -1;
    }

    return 0;
  });
}

function onStart() {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
}
</script>

<template>
  <div>
    <draggable
      v-model="items"
      handle=".Dragger"
      ghost-class="Ghost"
      animation="150"
      item-key="id"
      @start="onStart"
    >
      <template #item="{ element, index }">
        <div class="group relative mt-4 px-2 first:mt-0">
          <component
            :is="getComponent(element.type)"
            v-model="items[index]"
            :data-id="element.id"
            class="draggable-item"
          ></component>

          <button
            aria-label="drag and move item"
            tabindex="-1"
            class="Dragger absolute inset-y-0 left-0 flex w-3 -translate-x-1/2 transform items-center justify-center opacity-100 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0"
          >
            <SvgoDrag class="DragIcon fill-current" />
          </button>
          <button
            aria-label="remove item"
            class="privy-focus absolute inset-y-1/2 right-0 flex h-3 w-3 -translate-y-1/2 translate-x-1/2 transform justify-center opacity-100 transition-opacity duration-300 focus:opacity-100 group-hover:opacity-100 md:opacity-0"
            @click="onItemDelete(element.id)"
          >
            <SvgoCross class="w-2 fill-current" />
          </button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style>
.DragIcon {
  width: 0.75rem;
}

.light-mode .Ghost {
  background-color: theme("colors.neutral.500");
}

.dark-mode .Ghost {
  background-color: theme("colors.neutral.200");
}
</style>
