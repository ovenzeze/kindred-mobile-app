<template>
  <div class="flex w-full flex-col items-center justify-center py-12 px-6 text-center">
    <div 
      class="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl"
    >
      <div class="absolute inset-0 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <component :is="icon" class="relative size-10 text-primary/80" />
    </div>
    
    <div class="mt-8 flex flex-col gap-2">
      <h3 class="text-xl font-bold tracking-tight text-foreground">{{ title }}</h3>
      <p class="mx-auto max-w-[240px] text-[0.92rem] leading-relaxed text-muted-foreground/80">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.action || actionLabel" class="mt-10">
      <slot name="action">
        <Button 
          v-if="actionLabel" 
          variant="secondary" 
          class="rounded-full px-8 h-12 font-bold shadow-lg shadow-black/5"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { Button } from '~/components/ui/button';

interface Props {
  icon: Component;
  title: string;
  description: string;
  actionLabel?: string;
}

defineProps<Props>();
const emit = defineEmits(['action']);
</script>
