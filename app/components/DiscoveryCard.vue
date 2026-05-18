<template>
  <UCard
    class="w-full aspect-[3/4] flex items-center justify-center relative shadow-lg"
    :ui="{ root: 'overflow-hidden rounded-2xl bg-elevated', body: 'h-full p-0 sm:p-0' }"
  >
    <div class="h-full w-full relative">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        class="w-full h-full object-cover"
        alt="Profile Image"
      />
      <div v-else class="h-full w-full flex items-center justify-center animate-pulse text-dimmed">
        <UIcon name="i-lucide-user" class="w-20 h-20" />
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-inverted/80 via-inverted/20 to-transparent text-inverted text-left">
        <div class="flex items-end gap-2">
          <h2 class="text-2xl font-bold">{{ name }}</h2>
          <span class="text-lg mb-0.5 opacity-90">{{ age }}</span>
        </div>
        <p class="text-sm opacity-90 mt-1 line-clamp-2 leading-tight">{{ bio }}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <UBadge v-for="tag in tags" :key="tag" variant="soft" color="neutral" size="xs" class="bg-default/20 text-inverted border-none">
            {{ tag }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
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
