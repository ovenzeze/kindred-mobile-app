<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-default border-t border-muted p-2 flex justify-around items-center max-w-md mx-auto z-10">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center p-2 text-muted transition-colors duration-200 hover:text-highlighted"
      active-class="text-primary"
    >
      <UIcon :name="item.icon" class="w-6 h-6" />
      <span class="text-xs mt-1">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/', label: 'Discover', icon: 'i-lucide-sparkles' },
  { to: '/matches', label: 'Matches', icon: 'i-lucide-heart' },
  { to: '/chat', label: 'Chat', icon: 'i-lucide-message-circle' },
  { to: '/profile', label: 'Profile', icon: 'i-lucide-user' }
]
</script>
