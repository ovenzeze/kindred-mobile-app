<template>
  <header class="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <slot name="left">
        <h1 class="text-xl font-bold text-primary-600">Kindred</h1>
      </slot>
    </div>
    <div class="flex items-center gap-2">
      <slot name="right">
        <UButton icon="i-heroicons-bell" variant="ghost" color="gray" />
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component for Kindred Mobile App
</script>
