<template>
  <NuxtLink
    :to="`/chat/${id}`"
    class="kindred-glass kindred-tactile group flex items-center gap-4 rounded-[1.75rem] p-4 transition-all duration-500 hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-xl hover:shadow-black/5 border-none ring-1 ring-white/10"
  >
    <Avatar class="size-16 border-2 border-white/20 shadow-lg transition-transform duration-500 group-hover:scale-110">
      <AvatarImage :src="imageUrl" :alt="name" class="object-cover" />
      <AvatarFallback class="bg-primary/10 font-bold text-primary">{{ initials }}</AvatarFallback>
    </Avatar>

    <div class="min-w-0 flex-1">
      <div class="flex items-baseline justify-between gap-3">
        <h3 class="truncate text-base font-black tracking-tight text-foreground transition-colors group-hover:text-primary">{{ name }}</h3>
        <span class="shrink-0 text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground/40">{{ lastMessageTime }}</span>
      </div>
      <p class="mt-1 truncate text-sm font-medium leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90">{{ lastMessage }}</p>
    </div>

    <div v-if="unreadCount && unreadCount > 0" class="flex size-5 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/20">
      <span class="text-[10px] font-bold text-primary-foreground">{{ unreadCount }}</span>
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
