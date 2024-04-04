<script setup lang="ts">
interface Props {
  isActive?: boolean;
  label: string;
  tabindex: string;
  redirect?: string;
}
const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  redirect: null,
});

const component = props.redirect ? resolveComponent("NuxtLink") : "button";
</script>

<template>
  <transition name="fade">
    <nav v-if="isActive" class="fixed bottom-2vw right-4vw" :aria-label="label">
      <component
        :is="component"
        :aria-label="label"
        :tabindex="tabindex"
        :to="redirect"
        class="privy-focus-offset flex h-16 w-16 items-center justify-center rounded-full bg-secondary-500 text-white shadow-lg hover:bg-secondary-600"
      >
        <slot />
      </component>
    </nav>
  </transition>
</template>
