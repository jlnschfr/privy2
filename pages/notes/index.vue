<template>
  <div>
    <NuxtLayout name="default">
      <PrivyNoteOverview />

      <Button @click="navigateTo('/note/new')">add note</Button>
    </NuxtLayout>
  </div>
</template>
