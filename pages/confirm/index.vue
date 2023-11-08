<script setup lang="ts">
const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/notes");
    }
  },
  { immediate: true },
);
</script>

<template>
  <NuxtLayout name="blank">
    <div>
      <p class="u-text-black">Redirecting...</p>
    </div>
  </NuxtLayout>
</template>
