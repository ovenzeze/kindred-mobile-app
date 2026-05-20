<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-center" rich-colors />
</template>

<script setup lang="ts">
import { Toaster } from '~/components/ui/sonner';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>
