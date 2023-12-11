<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
const noteStore = useNoteStore();

// ref to store here
const rssItems: Ref<string[]> = ref([]);

const confirmDeleteWithMail: Ref<string> = ref("");
const errorMessage: Ref<string> = ref("");

const deleteAccount = async () => {
  noteStore.notes.forEach(async ({ id }) => {
    await noteStore.remove(id);
  });

  await useFetch("/api/delete", {
    headers: useRequestHeaders(["cookie"]),
    key: "delete",
  });

  await client.auth.signOut();
  navigateTo("/");
};
</script>

<template>
  <div
    class="transition-bgColor mx-auto max-w-lg bg-neutral-600 px-3 py-8 shadow-xl duration-300 dark:bg-neutral-100 md:px-6"
  >
    <header>
      <h2 class="hyphens-auto text-2xl font-bold leading-none">Admin Panel</h2>
      <p class="mt-3">
        You are registered and authenticated as
        <span class="whitespace-nowrap font-bold">{{ user?.email }}</span>
        through
        <span class="font-bold">{{ user?.app_metadata.provider }}</span
        >.
      </p>
    </header>

    <form class="mt-10">
      <h3 class="hyphens-auto text-xl font-bold leading-none">RSS Feeds</h3>
      <p class="mt-3">
        Deleting your account cannot be undone. Once your account has been
        deleted, it can't be recovered anymore. All notes are permanently lost.
      </p>
      <InputList v-model="rssItems" class="mt-3" />
    </form>

    <form class="mt-10" @submit.prevent="deleteAccount">
      <h3 class="hyphens-auto text-xl font-bold leading-none">Caution Area</h3>
      <p class="mt-3">
        Deleting your account cannot be undone. Once your account has been
        deleted, it can't be recovered anymore. All notes are permanently lost.
      </p>

      <TextInput
        v-model="confirmDeleteWithMail"
        placeholder="confirm with your mail"
        class="mt-3"
        @focus="errorMessage = ''"
      />

      <Button
        styling="tertiary"
        :disabled="confirmDeleteWithMail !== user?.email"
        type="submit"
        class="mt-3 w-full"
      >
        Delete Account
      </Button>

      <p
        v-if="errorMessage"
        class="mt-3 text-center text-sm text-secondary-500"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>
