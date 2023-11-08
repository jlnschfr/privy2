import { defineStore } from "pinia";

export const useTagStore = defineStore("TagStore", () => {
  const noteStore = useNoteStore();

  const availableTags: ComputedRef<string[]> = computed(() =>
    noteStore.notesNotTrashed
      .flatMap((note) => note.tags)
      .map((note) => note.text),
  );

  const uniqueTags: ComputedRef<string[]> = computed(() =>
    availableTags.value
      .filter(
        (note: string, pos: number, arr: string[]) => arr.indexOf(note) === pos,
      )
      .sort(),
  );

  const getTagAmount = (tag: string): number => {
    return tag
      ? availableTags.value.filter((note) => note === tag).length
      : noteStore.notesNotTrashed.length;
  };

  return {
    availableTags,
    uniqueTags,
    getTagAmount,
  };
});
