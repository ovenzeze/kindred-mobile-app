<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>
