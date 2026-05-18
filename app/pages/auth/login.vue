<template>
  <UForm :state="form" :validate="validateForm" class="space-y-6" @submit="handleSubmit">
    <UFormField label="Email" name="email" required>
      <UInput
        v-model="form.email"
        class="w-full"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :disabled="loading"
      />
    </UFormField>

    <UFormField label="Password" name="password" required>
      <UInput
        v-model="form.password"
        class="w-full"
        type="password"
        placeholder="Enter your password"
        autocomplete="current-password"
        :disabled="loading"
      />
    </UFormField>

    <UAlert
      v-if="authStore.error"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      :title="authStore.error"
      class="mb-4"
    />

    <UButton
      type="submit"
      block
      size="lg"
      :loading="loading"
      :disabled="loading"
    >
      Sign In
    </UButton>
  </UForm>

  <div class="mt-6 text-center">
    <p class="text-sm text-muted">
      Don't have an account?
      <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-primary/80">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
  authSubtitle: 'Sign in to your account',
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const loading = computed(() => authStore.loading);

type FormError = {
  name: string;
  message: string;
};

const validateForm = (state: typeof form): FormError[] => {
  const errors: FormError[] = [];
  if (!state.email) {
    errors.push({ name: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Please enter a valid email' });
  }

  if (!state.password) {
    errors.push({ name: 'password', message: 'Password is required' });
  }

  return errors;
};

const handleSubmit = async () => {
  const result = await authStore.login(form.email, form.password);

  if (result.success) {
    await router.push('/');
  }
};
</script>
