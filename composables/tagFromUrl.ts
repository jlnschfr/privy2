export function useTagFromUrl() {
  const route = useRoute();
  const tagStore = useTagStore();

  const activeTag: ComputedRef<string> = computed(() =>
    route.query.tag ? (route.query.tag as string) : "",
  );

  watch(
    activeTag,
    () => {
      tagStore.setActiveTag(activeTag.value);
    },
    { immediate: true },
  );

  return { activeTag };
}
