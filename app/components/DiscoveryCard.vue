<template>
  <Card class="kindred-glass-strong relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl p-0 shadow-2xl shadow-rose-950/15">
    <CardContent class="h-full w-full p-0">
    <div class="h-full w-full relative">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        class="w-full h-full object-cover"
        alt="Profile Image"
      />
      <div v-else class="h-full w-full flex items-center justify-center animate-pulse text-muted-foreground">
        <UserIcon class="size-20" />
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white text-left">
        <div class="flex items-end gap-2">
          <h2 class="text-2xl font-bold">{{ name }}</h2>
          <span class="text-lg mb-0.5 opacity-90">{{ age }}</span>
        </div>
        <p class="text-sm opacity-90 mt-1 line-clamp-2 leading-tight">{{ bio }}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <Badge v-for="tag in tags" :key="tag" variant="secondary" class="border-none bg-white/20 text-white">
            {{ tag }}
          </Badge>
        </div>
      </div>
    </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { UserIcon } from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';

interface Props {
  name: string
  age: number
  bio: string
  imageUrl?: string
  tags?: string[]
}
withDefaults(defineProps<Props>(), {
  tags: () => [],
  imageUrl: ''
})
</script>
