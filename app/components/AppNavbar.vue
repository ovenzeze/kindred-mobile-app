<template>
  <div class="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex justify-center p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
    <nav class="kindred-glass pointer-events-auto flex w-full max-w-sm items-center justify-around rounded-[2.5rem] p-1.5 shadow-2xl shadow-black/10">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="kindred-tactile group relative flex min-w-0 flex-1 flex-col items-center rounded-[2rem] py-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground"
        active-class="!text-primary"
      >
        <div class="relative z-10 flex flex-col items-center">
          <div class="relative">
            <div class="absolute -inset-3 rounded-full bg-primary/25 opacity-0 blur-xl transition-opacity duration-500 group-[.router-link-active]:opacity-100" />
            <component 
              :is="item.icon" 
              class="relative size-6 transition-all duration-500 group-[.router-link-active]:scale-110 group-[.router-link-active]:text-primary" 
              :stroke-width="item.stroke || 1.8"
            />
          </div>
          <span class="mt-1.5 text-[0.65rem] font-black uppercase tracking-[0.05em] transition-all duration-500 opacity-40 group-[.router-link-active]:opacity-100 group-[.router-link-active]:text-primary">
            {{ item.label }}
          </span>
        </div>
        <div class="absolute inset-x-1 inset-y-0.5 z-0 scale-90 bg-primary/5 opacity-0 transition-all duration-700 group-[.router-link-active]:scale-100 group-[.router-link-active]:opacity-100 rounded-[1.75rem]" />
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  CompassIcon,
  HeartIcon,
  MessageCircleIcon,
  PaletteIcon,
  UserIcon,
} from 'lucide-vue-next';

const coreNavItems = [
  { to: '/', label: 'Discover', icon: CompassIcon, stroke: 1.8 },
  { to: '/matches', label: 'Matches', icon: HeartIcon, stroke: 1.8 },
  { to: '/chat', label: 'Chat', icon: MessageCircleIcon, stroke: 1.8 },
  { to: '/profile', label: 'Profile', icon: UserIcon, stroke: 1.8 }
];

const navItems = computed(() => {
  if (!import.meta.dev) return coreNavItems;

  return [
    ...coreNavItems,
    { to: '/ui-kit', label: 'UI Kit', icon: PaletteIcon },
  ];
});
</script>

