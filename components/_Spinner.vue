<script setup lang="ts">
interface Props {
  isActive?: boolean;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
});
</script>

<template>
  <transition name="fade">
    <SvgoSpinner v-if="isActive" class="w-4" />
  </transition>
</template>
