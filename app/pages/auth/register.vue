<template>
  <UForm :state="form" :validate="validateForm" class="space-y-6" @submit="handleSubmit">
    <UFormField label="Display Name" name="displayName" required>
      <UInput
        v-model="form.displayName"
        class="w-full"
        type="text"
        placeholder="Your name"
        autocomplete="name"
        :disabled="loading"
      />
    </UFormField>

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
        placeholder="At least 8 characters"
        autocomplete="new-password"
        :disabled="loading"
      />
    </UFormField>

    <UFormField label="Confirm Password" name="confirmPassword" required>
      <UInput
        v-model="form.confirmPassword"
        class="w-full"
        type="password"
        placeholder="Confirm your password"
        autocomplete="new-password"
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
      Create Account
    </UButton>
  </UForm>

  <div class="mt-6 text-center">
    <p class="text-sm text-muted">
      Already have an account?
      <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-primary/80">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
  authSubtitle: 'Create your account',
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loading = computed(() => authStore.loading);

type FormError = {
  name: string;
  message: string;
};

const validateForm = (state: typeof form): FormError[] => {
  const errors: FormError[] = [];
  if (!state.displayName) {
    errors.push({ name: 'displayName', message: 'Display name is required' });
  } else if (state.displayName.length < 1 || state.displayName.length > 64) {
    errors.push({ name: 'displayName', message: 'Display name must be 1-64 characters' });
  }

  if (!state.email) {
    errors.push({ name: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Please enter a valid email' });
  }

  if (!state.password) {
    errors.push({ name: 'password', message: 'Password is required' });
  } else if (state.password.length < 8) {
    errors.push({ name: 'password', message: 'Password must be at least 8 characters' });
  }

  if (!state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Please confirm your password' });
  } else if (state.password !== state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

const handleSubmit = async () => {
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
