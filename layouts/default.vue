<script setup lang="ts">
const route = useRoute();
const user = useSupabaseUser();
const syncStore = useSyncStore();

const isSyncing: ComputedRef<boolean> = computed(() => syncStore.isSyncing);
const showButton: ComputedRef<boolean> = computed(() => route.name === "notes");
const showDrawer: Ref<boolean> = ref(false);
</script>

<template>
  <div
    class="min-h-screen bg-neutral-500 font-body font-normal text-neutral-200 transition-colors duration-300 dark:bg-neutral-50 dark:text-neutral-400"
  >
    <PrivyHeader @toggle-drawer="showDrawer = !showDrawer" />
    <PrivyDrawer
      :is-active="showDrawer"
      @toggle-drawer="showDrawer = !showDrawer"
    />
    <main class="relative p-4vw md:pl-app">
      <Spinner
        :is-active="isSyncing || !user"
        class="fixed bottom-2vw hidden md:block"
      />
      <slot />
    </main>
    <PrivyFloatingActionButton :is-active="showButton" />
    <Snackbar />
  </div>
</template>
