<template>
  <nav class="kindred-glass fixed bottom-0 left-0 right-0 z-10 mx-auto flex max-w-md items-center justify-around border-t border-white/35 p-2 dark:border-white/10">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex min-w-0 flex-1 flex-col items-center rounded-2xl p-2 text-muted transition-[background,color,transform] duration-200 hover:bg-default/45 hover:text-highlighted active:scale-95"
      active-class="!text-primary bg-primary/10"
    >
      <UIcon :name="item.icon" class="w-6 h-6" />
      <span class="mt-1 truncate text-xs">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const coreNavItems = [
  { to: '/', label: 'Discover', icon: 'i-lucide-sparkles' },
  { to: '/matches', label: 'Matches', icon: 'i-lucide-heart' },
  { to: '/chat', label: 'Chat', icon: 'i-lucide-message-circle' },
  { to: '/profile', label: 'Profile', icon: 'i-lucide-user' }
];

const navItems = computed(() => {
  if (!import.meta.dev) return coreNavItems;

  return [
    ...coreNavItems,
    { to: '/ui-kit', label: 'UI Kit', icon: 'i-lucide-palette' },
  ];
});
</script>
