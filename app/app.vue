<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>
