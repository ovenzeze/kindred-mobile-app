<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <h1 class="text-xl font-bold text-gray-900">Profile</h1>
      </template>
      <template #right>
        <UButton icon="i-heroicons-cog-6-tooth" variant="ghost" color="gray" />
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex flex-col items-center mb-8">
        <div class="relative">
          <UAvatar 
            src="https://i.pravatar.cc/150?u=me" 
            size="3xl"
            class="ring-4 ring-primary-500/20"
          />
          <UButton
            icon="i-heroicons-pencil"
            size="xs"
            color="primary"
            class="absolute bottom-0 right-0 rounded-full"
          />
        </div>
        <h2 class="text-2xl font-bold mt-4">Alex, 26</h2>
        <p class="text-gray-500">Product Designer</p>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <UCard class="text-center" :ui="{ body: { padding: 'p-4' } }">
          <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-blue-500 mx-auto" />
          <p class="text-xs font-medium mt-1">Verified</p>
        </UCard>
        <UCard class="text-center" :ui="{ body: { padding: 'p-4' } }">
          <UIcon name="i-heroicons-fire" class="w-6 h-6 text-orange-500 mx-auto" />
          <p class="text-xs font-medium mt-1">Premium</p>
        </UCard>
      </div>

      <div class="space-y-2">
        <UButton
          label="Edit Profile"
          icon="i-heroicons-user-edit"
          block
          variant="soft"
          color="gray"
        />
        <UButton
          label="Safety Center"
          icon="i-heroicons-shield-check"
          block
          variant="soft"
          color="gray"
        />
        <UButton
          label="Settings"
          icon="i-heroicons-adjustments-horizontal"
          block
          variant="soft"
          color="gray"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
