export function useQueryParams() {
  const route = useRoute();
  const router = useRouter();

  const activeTag: ComputedRef<string> = computed(() => {
    return route.query.tag ? (route.query.tag as string) : "";
  });

  function setActiveTag(tag: string) {
    router.push({ query: { ...route.query, tag } });
  }

  const activeFilter: ComputedRef<string> = computed(() => {
    return route.query.filter ? (route.query.filter as string) : "";
  });

  function setActiveFilter(filter: string) {
    router.push({ query: { ...route.query, filter } });
  }

  return { activeTag, setActiveTag, activeFilter, setActiveFilter };
}
