<script setup lang="ts">
interface Props {
  isActive?: boolean;
  label: string;
  tabindex: string;
  redirect: string;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
});
</script>

<template>
  <transition name="fade">
    <div v-if="isActive" class="fixed bottom-2vw right-4vw">
      <nuxt-link
        :aria-label="label"
        :tabindex="tabindex"
        :to="redirect"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-500 text-white shadow-lg hover:bg-secondary-600"
      >
        <SvgoPlus class="w-3 fill-current" />
      </nuxt-link>
    </div>
  </transition>
</template>
