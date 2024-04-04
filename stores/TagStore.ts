import { defineStore } from "pinia";

export const useTagStore = defineStore("TagStore", () => {
  const noteStore = useNoteStore();

  const tags: ComputedRef<string[]> = computed(() =>
    noteStore.notesNotTrashed
      .flatMap((note: Note) => note.tags)
      .map((tag: Tag) => tag.text),
  );

  const uniqueTags: ComputedRef<string[]> = computed(() =>
    tags.value
      .filter(
        (tag: string, pos: number, arr: string[]) => arr.indexOf(tag) === pos,
      )
      .sort(),
  );

  const getTagAmount = (requestedTag: string): number => {
    return requestedTag
      ? tags.value?.filter((tag) => tag === requestedTag).length
      : noteStore.notesNotTrashed.length;
  };

  return {
    tags,
    uniqueTags,
    getTagAmount,
  };
});
