<template>
  <NuxtLink
    :to="'/chat/' + id"
    class="flex items-center gap-3 p-4 hover:bg-elevated transition-colors border-b border-muted"
  >
    <UAvatar
      :src="imageUrl"
      :alt="name"
      size="lg"
      class="shadow-sm"
    />

    <div class="flex-1 overflow-hidden">
      <div class="flex justify-between items-baseline">
        <h3 class="font-semibold text-highlighted truncate">{{ name }}</h3>
        <span class="text-dimmed text-xs">{{ lastMessageTime }}</span>
      </div>
      <p class="text-sm text-muted truncate mt-0.5">{{ lastMessage }}</p>
    </div>

    <div v-if="unreadCount && unreadCount > 0" class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
      <span class="text-inverted text-[10px] font-medium">{{ unreadCount }}</span>
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
