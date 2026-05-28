<template>
  <div class="flex min-h-screen flex-col bg-transparent">
    <div class="flex flex-1 flex-col justify-center px-6 py-12">
      <div class="mx-auto w-full max-w-sm">
        <div class="text-center mb-10">
          <h1 class="kindred-gradient-text text-6xl font-black tracking-tighter">Kindred</h1>
          <p class="mt-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <slot name="subtitle">{{ route.meta.authSubtitle }}</slot>
          </p>
        </div>
        <div class="kindred-glass-strong rounded-[3rem] border-none p-8 shadow-2xl shadow-black/10 bg-white/40 dark:bg-black/20">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
const route = useRoute();
</script>
