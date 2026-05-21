<template>
  <NuxtLink
    :to="'/chat/' + id"
    class="flex items-center gap-3 border-b border-white/35 bg-card/20 p-4 backdrop-blur-xl transition-colors hover:bg-card/35 dark:border-white/10"
  >
    <Avatar size="lg" class="shadow-sm">
      <AvatarImage :src="imageUrl" :alt="name" />
      <AvatarFallback>{{ initials }}</AvatarFallback>
    </Avatar>

    <div class="flex-1 overflow-hidden">
      <div class="flex justify-between items-baseline">
        <h3 class="font-semibold text-foreground truncate">{{ name }}</h3>
        <span class="text-muted-foreground text-xs">{{ lastMessageTime }}</span>
      </div>
      <p class="text-sm text-muted-foreground truncate mt-0.5">{{ lastMessage }}</p>
    </div>

    <div v-if="unreadCount && unreadCount > 0" class="flex size-5 items-center justify-center rounded-full bg-primary">
      <span class="text-primary-foreground text-[10px] font-medium">{{ unreadCount }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

interface Props {
  id: string
  name: string
  imageUrl: string
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number
}

const props = defineProps<Props>();

const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean);
  return words.length > 0
    ? words.map((word) => word[0]).join('').slice(0, 2).toUpperCase()
    : '?';
});
</script>
