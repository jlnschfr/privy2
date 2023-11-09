<script setup lang="ts">
import { v4 as uuid } from "uuid";
const route = useRoute();
const noteStore = useNoteStore();

const id: ComputedRef<string> = computed(() => route.params.id as string);
const isNew: ComputedRef<boolean> = computed(() => id.value === "new");

if (isNew.value) {
  await noteStore.add({ id: uuid() }, { redirect: true });
}
</script>

<template>
  <NuxtLayout name="default">
    <PrivyNoteDetail :note-id="id" />
  </NuxtLayout>
</template>
