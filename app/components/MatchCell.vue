<template>
  <NuxtLink 
    :to="'/chat/' + id" 
    class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b"
  >
    <UAvatar 
      :src="imageUrl" 
      :alt="name" 
      size="lg"
      class="shadow-sm"
    />
    
    <div class="flex-1 overflow-hidden">
      <div class="flex justify-between items-baseline">
        <h3 class="font-semibold text-gray-900 truncate">{{ name }}</h3>
        <span class="text-gray-400 text-xs">{{ lastMessageTime }}</span>
      </div>
      <p class="text-sm text-gray-500 truncate mt-0.5">{{ lastMessage }}</p>
    </div>
    
    <div v-if="unreadCount && unreadCount > 0" class="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
      <span class="text-white text-[10px] font-medium">{{ unreadCount }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  id: string
  name: string
  imageUrl: string
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number
}

defineProps<Props>()
</script>
