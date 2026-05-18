<template>
  <div class="min-h-screen bg-default flex flex-col">
    <div class="flex-1 flex flex-col justify-center px-6 py-12">
      <div class="mx-auto w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-highlighted">Kindred</h1>
          <p class="mt-2 text-sm text-muted">
            <slot name="subtitle">{{ route.meta.authSubtitle }}</slot>
          </p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
