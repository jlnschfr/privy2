<script setup lang="ts">
import { isValidUrl } from "@/utils/url";

const user = useSupabaseUser();
const client = useSupabaseClient();
const noteStore = useNoteStore();

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

const rssStore = useRssStore();
const rssUrls: Ref<string[]> = ref(
  rssStore.feeds ? rssStore.feeds?.map((feed) => feed.url) : [],
);

watch(
  rssUrls,
  async (newValue: string[], oldValue: string[]) => {
    if (newValue.length < oldValue.length) {
      const removedUrls = oldValue.filter((el) => !newValue.includes(el));
      await rssStore.remove(removedUrls[0]);
    } else {
      const lastUrl = rssUrls.value[rssUrls.value.length - 1];
      await rssStore.add(lastUrl);
    }
  },
  { deep: true },
);

function onInvalidListInput(msg: string) {
  // TODO: show snackbar with invalid input
  console.log(msg);
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
        Deleting your account cannot be undone. Once your account has been
        deleted, it can't be recovered anymore. All notes are permanently lost.
      </p>
      <InputList
        v-model="rssUrls"
        :validator="isValidUrl"
        class="mt-3"
        @invalid-input="onInvalidListInput"
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
