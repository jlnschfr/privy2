<script setup lang="ts">
interface Props {
  width?: string;
}
const props = withDefaults(defineProps<Props>(), {
  width: "4",
});

const route = useRoute();
const svg: Ref = ref();

const widthClass: ComputedRef<string> = computed(() => `w-${props.width}`);
const paths: ComputedRef<SVGElement[]> = computed(() => [
  ...svg.value.$el.querySelectorAll("path"),
]);

watch([() => route.params, () => route.name], () => {
  animatePaths();
});

function animatePaths() {
  if (paths.value) {
    paths.value?.forEach((path, index) => {
      setTimeout(() => {
        path.classList.add("has-fill-animation");

        setTimeout(() => {
          path.classList.remove("has-fill-animation");
        }, 750);
      }, 100 * index);
    });
  }
}
</script>

<template>
  <nuxt-link to="/notes/" aria-label="Privy Notes" class="privy-focus">
    <SvgoPrivy ref="svg" :class="widthClass"
  /></nuxt-link>
</template>

<style>
.has-fill-animation {
  animation: fill 0.75s ease forwards;
}

@keyframes fill {
  0% {
    fill: current;
  }
  50% {
    fill: theme("colors.secondary.500");
  }
  100% {
    fill: current;
  }
}
</style>
