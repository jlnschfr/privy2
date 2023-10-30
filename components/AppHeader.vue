<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();
const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const logout = async () => {
  await client.auth.signOut();
  navigateTo("/");
};
</script>

<template>
  <div>
    <Title>Privy Notes</Title>
    <div class="flex items-center justify-center md:justify-between">
      <div class="flex items-center">
        <button variant="transparent" @click="toggleDark">darkmode</button>

        <button
          v-if="user"
          class="u-text-white"
          variant="transparent"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
