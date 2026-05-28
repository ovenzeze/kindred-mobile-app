<template>
  <Card class="kindred-glass-strong relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[2.5rem] p-0 shadow-2xl shadow-black/8">
    <CardContent class="h-full w-full p-0">
    <div class="relative h-full w-full">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        class="h-full w-full object-cover"
        :alt="`${name} profile photo`"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-muted/45 text-muted-foreground">
        <div class="kindred-glass flex size-24 items-center justify-center rounded-full">
          <UserIcon class="size-12" />
        </div>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div class="absolute left-0 right-0 top-0 flex items-center justify-between p-6">
        <Badge variant="secondary" class="border-white/10 bg-black/20 text-white shadow-none backdrop-blur-xl">
          <SparklesIcon data-icon="inline-start" class="text-warning" />
          Curated
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          class="size-10 rounded-full bg-black/20 text-white backdrop-blur-xl hover:bg-black/30"
          @click.stop="emit('show-details')"
        >
          <InfoIcon class="size-6" />
        </Button>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-8 text-left text-white">
        <div class="flex flex-wrap items-end gap-2.5">
          <h2 class="text-3xl font-bold leading-none tracking-tight">{{ name }}</h2>
          <span v-if="age > 0" class="mb-0.5 text-xl font-semibold opacity-90">{{ age }}</span>
        </div>
        <p class="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-white/90">{{ bio || 'No bio yet.' }}</p>
        <div v-if="tags.length" class="mt-5 flex flex-wrap gap-2">
          <Badge v-for="tag in tags" :key="tag" variant="secondary" class="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-xl">
            {{ tag }}
          </Badge>
        </div>
      </div>
    </div>
    </CardContent>
  </Card>
</template>


<script setup lang="ts">
import { InfoIcon, SparklesIcon, UserIcon } from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

interface Props {
  name: string
  age: number
  bio: string
  imageUrl?: string
  tags?: string[]
}

const emit = defineEmits(['show-details']);
withDefaults(defineProps<Props>(), {
  tags: () => [],
  imageUrl: ''
})
</script>
