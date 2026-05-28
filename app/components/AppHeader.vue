<template>
  <header class="sticky top-0 z-20 flex min-h-20 items-center justify-between px-6 py-4 backdrop-blur-xl transition-all duration-500 border-b border-white/5 bg-background/30">
    <div class="flex min-w-0 items-center gap-2">
      <slot name="left">
        <div class="flex flex-col">
          <p class="kindred-section-kicker opacity-60">Kindred</p>
          <h1 class="kindred-section-title -mt-1 font-black tracking-tighter">Discover</h1>
        </div>
      </slot>
    </div>
    <div class="flex items-center gap-3">
      <slot name="right">
        <Button variant="outline" size="icon" class="size-11 rounded-full border-white/10 bg-white/5 shadow-none backdrop-blur-xl ring-1 ring-white/10" aria-label="Notifications">
          <BellIcon class="size-5 text-foreground/80" />
        </Button>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BellIcon } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
</script>

