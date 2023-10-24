<template>
  <form
    class="max-w-md mx-auto px-3 md:px-6 py-8 shadow-xl bg-neutral-600 dark:bg-neutral-100 absolute left-4vw right-4vw top-50 transform -translate-y-1/2 transition duration-300"
    @submit.prevent="authenticate"
  >
    <header class="flex justify-center">
      <SvgoPrivy class="w-5" />
    </header>

    <Button type="submit" class="w-full mt-6"> Login with Github </Button>
  </form>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseClient();

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

watchEffect(() => {
  if (user.value) {
    navigateTo("/tasks");
  }
});

function authenticate() {
  auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
}
</script>
