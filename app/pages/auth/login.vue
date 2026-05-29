<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
    <FieldGroup>
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
        placeholder="Enter your password"
        autocomplete="current-password"
        class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
        :aria-invalid="!!fieldErrors.password"
        :disabled="loading"
      />
        <FieldError v-if="fieldErrors.password">{{ fieldErrors.password }}</FieldError>
      </Field>
    </FieldGroup>

    <Alert v-if="authStore.error" variant="destructive" class="rounded-2xl">
      <CircleAlertIcon />
      <AlertTitle>{{ authStore.error }}</AlertTitle>
    </Alert>

    <Button
      type="submit"
      size="lg"
      class="w-full rounded-full font-bold shadow-lg shadow-primary/10"
      :disabled="loading"
    >
      <Spinner v-if="loading" data-icon="inline-start" />
      Sign In
    </Button>

    <div class="flex items-center gap-4 py-2">
      <Separator class="flex-1 opacity-50" />
      <span class="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60">Or</span>
      <Separator class="flex-1 opacity-50" />
    </div>

    <Button
      type="button"
      variant="outline"
      class="w-full rounded-full border-white/20 bg-white/5 font-bold shadow-sm"
      :disabled="loading"
      @click="authStore.loginWithGoogle()"
    >
      <ChromeIcon data-icon="inline-start" class="size-4" />
      Google
    </Button>
  </form>

  <div class="mt-8 text-center">
    <p class="text-sm text-muted-foreground">
      New to Kindred?
      <NuxtLink to="/auth/register" class="font-bold text-primary hover:text-primary/80 transition-colors">
        Create an account
      </NuxtLink>
    </p>
  </div>
</template>


<script setup lang="ts">
import { ChromeIcon, CircleAlertIcon } from 'lucide-vue-next';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { Spinner } from '~/components/ui/spinner';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
  authSubtitle: 'Welcome back',
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const fieldErrors = reactive({
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
  fieldErrors.email = '';
  fieldErrors.password = '';

  const errors = validateForm(form);
  for (const error of errors) {
    fieldErrors[error.name as keyof typeof fieldErrors] = error.message;
  }
  if (errors.length > 0) return;

  const result = await authStore.login(form.email, form.password);

  if (result.success) {
    await router.push('/');
  }
};
</script>
