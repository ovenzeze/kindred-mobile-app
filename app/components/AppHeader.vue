<template>
  <header class="kindred-glass sticky top-0 z-10 flex items-center justify-between border-b border-white/35 p-4 dark:border-white/10">
    <div class="flex items-center gap-2">
      <slot name="left">
        <h1 class="kindred-gradient-text text-xl font-bold">Kindred</h1>
      </slot>
    </div>
    <div class="flex items-center gap-2">
      <slot name="right">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellIcon />
        </Button>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BellIcon } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
</script>
