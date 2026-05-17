<template>
  <div class="p-4 flex flex-col items-center justify-center h-full text-center">
    <!-- Discovery Card Component -->
    <DiscoveryCard 
      name="Sarah" 
      :age="24" 
      bio="Coffee lover, world traveler, and amateur photographer. Looking for someone to explore the city with!"
      :tags="['Travel', 'Coffee', 'Photography']"
    />

    <!-- Action Buttons -->
    <div class="flex gap-4 mt-8">
      <UButton
        icon="i-heroicons-x-mark"
        size="xl"
        color="red"
        variant="soft"
        class="rounded-full w-16 h-16 flex justify-center shadow-md active:scale-95 transition-transform"
      />
      <UButton
        icon="i-heroicons-star"
        size="lg"
        color="blue"
        variant="soft"
        class="rounded-full w-12 h-12 flex justify-center mt-2 shadow-sm active:scale-95 transition-transform"
      />
      <UButton
        icon="i-heroicons-heart"
        size="xl"
        color="green"
        variant="soft"
        class="rounded-full w-16 h-16 flex justify-center shadow-md active:scale-95 transition-transform"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
