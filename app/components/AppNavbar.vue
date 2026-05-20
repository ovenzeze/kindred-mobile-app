<template>
  <nav class="kindred-glass fixed bottom-0 left-0 right-0 z-10 mx-auto flex max-w-md items-center justify-around border-t border-white/35 p-2 dark:border-white/10">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex min-w-0 flex-1 flex-col items-center rounded-2xl p-2 text-muted-foreground transition-[background,color,transform] duration-200 hover:bg-background/45 hover:text-foreground active:scale-95"
      active-class="!text-primary bg-primary/10"
    >
      <component :is="item.icon" class="size-6" />
      <span class="mt-1 truncate text-xs">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import {
  HeartIcon,
  MessageCircleIcon,
  PaletteIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-vue-next';

const coreNavItems = [
  { to: '/', label: 'Discover', icon: SparklesIcon },
  { to: '/matches', label: 'Matches', icon: HeartIcon },
  { to: '/chat', label: 'Chat', icon: MessageCircleIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon }
];

const navItems = computed(() => {
  if (!import.meta.dev) return coreNavItems;

  return [
    ...coreNavItems,
    { to: '/ui-kit', label: 'UI Kit', icon: PaletteIcon },
  ];
});
</script>
