<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex flex-1 flex-col justify-center px-6 py-12">
      <div class="mx-auto w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="kindred-gradient-text text-3xl font-bold">Kindred</h1>
          <p class="mt-2 text-sm text-muted-foreground">
            <slot name="subtitle">{{ route.meta.authSubtitle }}</slot>
          </p>
        </div>
        <div class="kindred-glass-strong rounded-3xl p-5">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
