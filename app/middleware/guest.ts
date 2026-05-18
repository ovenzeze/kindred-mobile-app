export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (import.meta.client && !authStore.isAuthenticated) {
    await authStore.initialize();
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
