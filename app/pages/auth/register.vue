<template>
  <div>
    <NuxtLayout name="auth">
      <template #subtitle>
        Create your account
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormField label="Display Name" name="displayName">
          <UInput
            v-model="form.displayName"
            type="text"
            placeholder="Your name"
            autocomplete="name"
            :disabled="loading"
            :error="errors.displayName"
          />
        </UFormField>

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
            placeholder="At least 8 characters"
            autocomplete="new-password"
            :disabled="loading"
            :error="errors.password"
          />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
            :disabled="loading"
            :error="errors.confirmPassword"
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
          Create Account
        </UButton>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in
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
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loading = computed(() => authStore.loading);

const validateForm = () => {
  errors.displayName = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!form.displayName) {
    errors.displayName = 'Display name is required';
  } else if (form.displayName.length < 1 || form.displayName.length > 64) {
    errors.displayName = 'Display name must be 1-64 characters';
  }

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return !errors.displayName && !errors.email && !errors.password && !errors.confirmPassword;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await authStore.register(
    form.email,
    form.password,
    form.displayName || undefined
  );

  if (result.success) {
    await router.push('/');
  }
};
</script>
