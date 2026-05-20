<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <LoaderCircleIcon class="mx-auto size-8 animate-spin text-primary" />
      <p class="mt-4 text-muted-foreground">Completing sign in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircleIcon } from 'lucide-vue-next';

const supabase = useSupabaseClient();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Wait for Supabase to initialize the session
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('OAuth error:', error);
    await router.push('/auth/login');
    return;
  }

  // Map Supabase session to our store's format
  authStore.setSession({
    accessToken: session.access_token,
    refreshToken: session.refresh_token!,
    expiresAt: session.expires_at!,
    userId: session.user.id,
  }, session.user.id);

  const profileResult = await authStore.ensureProfile();
  if (!profileResult.success) {
    console.error('Profile setup failed:', profileResult.error);
  }

  await router.push(profileResult.success ? '/' : '/profile');
});
</script>
