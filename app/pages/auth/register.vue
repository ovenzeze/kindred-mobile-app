<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
    <FieldGroup>
      <Field :data-invalid="!!fieldErrors.displayName">
        <FieldLabel for="displayName">Display Name</FieldLabel>
        <Input
        id="displayName"
        v-model="form.displayName"
        type="text"
        placeholder="Your name"
        autocomplete="name"
        class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
        :aria-invalid="!!fieldErrors.displayName"
        :disabled="loading"
      />
        <FieldError v-if="fieldErrors.displayName">{{ fieldErrors.displayName }}</FieldError>
      </Field>

      <Field :data-invalid="!!fieldErrors.email">
        <FieldLabel for="email">Email</FieldLabel>
        <Input
        id="email"
        v-model="form.email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
        :aria-invalid="!!fieldErrors.email"
        :disabled="loading"
      />
        <FieldError v-if="fieldErrors.email">{{ fieldErrors.email }}</FieldError>
      </Field>

      <Field :data-invalid="!!fieldErrors.password">
        <FieldLabel for="password">Password</FieldLabel>
        <Input
        id="password"
        v-model="form.password"
        type="password"
        placeholder="At least 8 characters"
        autocomplete="new-password"
        class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
        :aria-invalid="!!fieldErrors.password"
        :disabled="loading"
      />
        <FieldError v-if="fieldErrors.password">{{ fieldErrors.password }}</FieldError>
      </Field>

      <Field :data-invalid="!!fieldErrors.confirmPassword">
        <FieldLabel for="confirmPassword">Confirm Password</FieldLabel>
        <Input
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        placeholder="Confirm your password"
        autocomplete="new-password"
        class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
        :aria-invalid="!!fieldErrors.confirmPassword"
        :disabled="loading"
      />
        <FieldError v-if="fieldErrors.confirmPassword">{{ fieldErrors.confirmPassword }}</FieldError>
      </Field>
    </FieldGroup>

    <Alert v-if="authStore.error" variant="destructive" class="rounded-2xl">
      <CircleAlertIcon />
      <AlertTitle>{{ authStore.error }}</AlertTitle>
    </Alert>

    <Button
      type="submit"
      @click.prevent="handleSubmit"
      size="lg"
      class="w-full rounded-full font-bold shadow-lg shadow-primary/10"
      :disabled="loading"
    >
      <Spinner v-if="loading" data-icon="inline-start" />
      Join Kindred
    </Button>
  </form>

  <div class="mt-8 text-center">
    <p class="text-sm text-muted-foreground">
      Already a member?
      <NuxtLink to="/auth/login" class="font-bold text-primary hover:text-primary/80 transition-colors">
        Welcome back
      </NuxtLink>
    </p>
  </div>
</template>


<script setup lang="ts">
import { CircleAlertIcon } from 'lucide-vue-next';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Spinner } from '~/components/ui/spinner';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
  authSubtitle: 'Begin your journey',
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const fieldErrors = reactive({
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
  fieldErrors.displayName = '';
  fieldErrors.email = '';
  fieldErrors.password = '';
  fieldErrors.confirmPassword = '';

  const errors = validateForm(form);
  for (const error of errors) {
    fieldErrors[error.name as keyof typeof fieldErrors] = error.message;
  }
  if (errors.length > 0) return;

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
