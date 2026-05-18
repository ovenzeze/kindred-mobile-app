<template>
  <header class="p-4 bg-default border-b border-muted flex justify-between items-center sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <slot name="left">
        <h1 class="text-xl font-bold text-primary">Kindred</h1>
      </slot>
    </div>
    <div class="flex items-center gap-2">
      <slot name="right">
        <UButton icon="i-lucide-bell" variant="ghost" color="neutral" aria-label="Notifications" />
      </slot>
    </div>
  </header>
</template>
