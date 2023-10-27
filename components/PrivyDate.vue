<script setup lang="ts">
import { createDateString } from "@/utils/date";

export interface Props {
  date: string;
}

const props = defineProps<Props>();

const month: ComputedRef<string> = computed(() =>
  createDateString(props.date, { month: "short" }),
);

const day: ComputedRef<string> = computed(() =>
  createDateString(props.date, { day: "2-digit" }),
);

const year: ComputedRef<string> = computed(() =>
  createDateString(props.date, { year: "numeric" }),
);
</script>

<template>
  <div
    class="mr-2 border-r border-neutral-400 pr-2 text-center transition duration-300 dark:border-neutral-200"
  >
    <span class="block">{{ month }}</span>
    <span class="block text-xl font-bold">{{ day }}</span>
    <span class="block">{{ year }}</span>
  </div>
</template>
