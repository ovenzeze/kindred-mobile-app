<template>
  <div>
    <NuxtLayout name="auth">
      <template #subtitle>
        Sign in to your account
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormField label="Email" name="email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            :disabled="loading"
            :error="errors.email"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            :disabled="loading"
            :error="errors.password"
          />
        </UFormField>

        <UAlert
          v-if="authStore.error"
          icon="i-heroicons-exclamation-circle"
          color="red"
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
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: false, // This page is accessible without authentication
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const loading = computed(() => authStore.loading);

const validateForm = () => {
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  }

  return !errors.email && !errors.password;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await authStore.login(form.email, form.password);

  if (result.success) {
    await router.push('/');
  }
};
</script>
