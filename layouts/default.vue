<script setup lang="ts">
const showDrawer: Ref<boolean> = ref(false);
</script>

<template>
  <div
    class="min-h-screen bg-neutral-500 font-body font-normal text-neutral-200 transition duration-300 dark:bg-neutral-50 dark:text-neutral-400"
  >
    <PrivyHeader @toggle-drawer="showDrawer = !showDrawer" />
    <PrivyDrawer
      :is-active="showDrawer"
      @toggle-drawer="showDrawer = !showDrawer"
    />
    <main class="relative p-4vw md:pl-app">
      <slot />
    </main>
    <Snackbar />
  </div>
</template>
