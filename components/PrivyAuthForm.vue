<script setup lang="ts">
import { Filter } from "@/types/enums";

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const path = `/notes?filter=${Filter.Favorites}`;
const redirectTo: string = `${useRuntimeConfig().public.baseUrl}${path}`;

watchEffect(() => {
  if (user.value) {
    navigateTo(path);
  }
});

function authenticate() {
  auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
}
</script>

<template>
  <form
    class="absolute left-4vw right-4vw top-50 mx-auto max-w-md -translate-y-1/2 transform bg-neutral-600 px-3 py-8 shadow-xl transition-bgColor duration-300 dark:bg-neutral-100 md:px-6"
    @submit.prevent="authenticate"
  >
    <header class="flex justify-center">
      <SvgoPrivy class="w-5" />
    </header>

    <Button type="submit" class="mt-6 w-full">Login with Github</Button>
  </form>
</template>
