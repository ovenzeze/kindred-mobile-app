<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around items-center max-w-md mx-auto z-10">
    <NuxtLink 
      v-for="item in navItems" 
      :key="item.to"
      :to="item.to" 
      class="flex flex-col items-center p-2 transition-colors duration-200" 
      active-class="text-primary-600"
    >
      <UIcon :name="item.icon" class="w-6 h-6" />
      <span class="text-xs mt-1">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/', label: 'Discover', icon: 'i-heroicons-sparkles' },
  { to: '/matches', label: 'Matches', icon: 'i-heroicons-heart' },
  { to: '/chat', label: 'Chat', icon: 'i-heroicons-chat-bubble-left-right' },
  { to: '/profile', label: 'Profile', icon: 'i-heroicons-user' }
]
</script>
