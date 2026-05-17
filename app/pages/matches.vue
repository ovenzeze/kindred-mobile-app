<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <h1 class="text-xl font-bold text-gray-900">Matches</h1>
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto">
      <div v-if="matches.length > 0">
        <MatchCell 
          v-for="match in matches" 
          :key="match.id"
          v-bind="match"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400">
        <UIcon name="i-heroicons-heart" class="w-12 h-12 opacity-20" />
        <p class="mt-2">No matches yet. Keep exploring!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const matches = [
  {
    id: '1',
    name: 'Sarah',
    imageUrl: 'https://i.pravatar.cc/150?u=sarah',
    lastMessage: 'That sounds like fun! When are you free?',
    lastMessageTime: '2m',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Jessica',
    imageUrl: 'https://i.pravatar.cc/150?u=jessica',
    lastMessage: 'I love that place too!',
    lastMessageTime: '1h',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Emily',
    imageUrl: 'https://i.pravatar.cc/150?u=emily',
    lastMessage: 'Hey there!',
    lastMessageTime: '3h',
    unreadCount: 0
  }
]
</script>
