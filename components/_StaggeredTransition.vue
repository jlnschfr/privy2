<script setup lang="ts">
function beforeEnter(el: Element) {
  const element = el as HTMLElement;
  element.style.transitionDelay =
    Number(element.dataset.index) < 6
      ? `${Number(element.dataset.index) * 25}ms`
      : `${6 * 25}ms`;
}
</script>

<template>
  <transition-group
    tag="div"
    name="staggered-transition"
    mode="out-in"
    @before-enter="beforeEnter"
  >
    <slot></slot>
  </transition-group>
</template>

<style>
.staggered-transition-enter-active,
.staggered-transition-leave-active {
  transition: all 300ms ease;
}
.staggered-transition-enter,
.staggered-transition-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
