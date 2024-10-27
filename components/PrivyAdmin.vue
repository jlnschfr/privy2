<script setup lang="ts">
import { isValidUrl } from "@/utils/url";

const user = useSupabaseUser();
const client = useSupabaseClient();
const noteStore = useNoteStore();
const rssStore = useRssStore();
const snackbarStore = useSnackbarStore();
const syncStore = useSyncStore();

const confirmDeleteWithMail: Ref<string> = ref("");
const errorMessage: Ref<string> = ref("");

const feedUrls: ComputedRef<string[]> = computed(() => rssStore.feedUrls);

async function deleteAccount() {
  syncStore.setIsSyncing(true);

  const noteIdsToRemove = noteStore.notes.map(({ id }) => id);
  const rssUrlsToRemove = rssStore.feeds.map(({ url }) => url);
  const userIdToBeDeleted = user.value.id;

  await Promise.all(
    noteIdsToRemove.map(async (id) => {
      await noteStore.remove(id);
    }),
  );

  await Promise.all(
    rssUrlsToRemove.map(async (url) => {
      await rssStore.remove(url);
    }),
  );

  await client.auth.signOut();
  navigateTo("/");

  await $fetch("/.netlify/functions/delete", {
    query: { id: userIdToBeDeleted },
  });

  syncStore.setIsSyncing(false);
}

function onInvalidListInput() {
  snackbarStore.show({
    text: "Please enter a valid URL.",
  });
}

async function onListChange(value: string[]) {
  if (value.length < feedUrls.value.length) {
    const removedUrls = feedUrls.value.filter((el) => !value.includes(el));
    await rssStore.remove(removedUrls[0]);
  } else {
    const lastAddedUrl = value[value.length - 1];
    await rssStore.add(lastAddedUrl);
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-lg bg-neutral-600 px-3 py-8 shadow-xl transition-bgColor duration-300 dark:bg-neutral-100 md:px-6"
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
        Manage your current RSS feeds. Remove current subscriptions or add more
        by entering new Urls.
      </p>
      <InputList
        :model-value="feedUrls"
        :validator="isValidUrl"
        class="mt-3"
        @invalid-input="onInvalidListInput"
        @update:model-value="onListChange($event)"
      />
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
