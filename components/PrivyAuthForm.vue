<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const redirectTo: string = `${useRuntimeConfig().public.baseUrl}/notes`;

watchEffect(() => {
  if (user.value) {
    navigateTo("/notes");
  }
});

function authenticate() {
  auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
}
</script>

<template>
  <form
    class="transition-bgColor absolute left-4vw right-4vw top-50 mx-auto max-w-md -translate-y-1/2 transform bg-neutral-600 px-3 py-8 shadow-xl duration-300 dark:bg-neutral-100 md:px-6"
    @submit.prevent="authenticate"
  >
    <header class="flex justify-center">
      <SvgoPrivy class="w-5" />
    </header>

    <Button type="submit" class="mt-6 w-full">Login with Github</Button>
  </form>
</template>
