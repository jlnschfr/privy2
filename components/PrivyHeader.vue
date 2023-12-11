<script setup lang="ts">
interface Emits {
  (e: "toggle-drawer"): void;
}
const emit = defineEmits<Emits>();

const user = useSupabaseUser();
const noteStore = useNoteStore();

const isSyncing: ComputedRef<boolean> = computed(() => noteStore.isSyncing);
</script>

<template>
  <header
    class="transition-borderAndBgColor flex items-center justify-between border-b border-neutral-400 bg-neutral-600 px-4vw py-2 duration-300 dark:border-neutral-200 dark:bg-neutral-50 md:justify-end md:pl-app"
  >
    <div class="flex items-center md:hidden">
      <h1 aria-label="Privy Notes" class="mr-2">
        <PrivyLogo />
      </h1>
      <Spinner :is-active="isSyncing || !user" />
    </div>
    <nav class="flex items-center" aria-label="Update your profile">
      <nuxt-link
        to="/admin/"
        class="privy-focus flex items-center justify-center"
      >
        My Privy
      </nuxt-link>
      <p class="ml-2 block md:hidden" @click="emit('toggle-drawer')">
        <SvgoMenu class="w-3 cursor-pointer fill-current" />
      </p>
    </nav>
  </header>
</template>
