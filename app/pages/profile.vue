<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <h1 class="text-xl font-bold text-foreground">Profile</h1>
      </template>
      <template #right>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Log out"
          @click="handleLogout"
        >
          <LogOutIcon />
        </Button>
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="loading" class="flex flex-col gap-4">
        <Skeleton class="mx-auto size-24 rounded-full" />
        <Skeleton class="mx-auto h-6 w-40" />
        <Skeleton class="mx-auto h-4 w-56" />
      </div>

      <template v-else-if="needsSetup">
        <div class="flex flex-col items-center mb-8">
          <Avatar class="size-24 ring-4 ring-primary/20">
            <AvatarFallback>
              <UserIcon class="size-10" />
            </AvatarFallback>
          </Avatar>
          <h2 class="text-2xl font-bold mt-4">Set up your profile</h2>
          <p class="text-muted-foreground text-center mt-1">Add a display name to get started.</p>
        </div>
        <FieldGroup class="mb-4">
          <Field :data-invalid="!!saveError">
            <FieldLabel for="setup-display-name">Display name</FieldLabel>
            <Input
              id="setup-display-name"
              v-model="editForm.displayName"
              placeholder="Your name"
              :aria-invalid="!!saveError"
            />
          </Field>
        </FieldGroup>
        <Alert v-if="saveError" variant="destructive" class="mb-4">
          <CircleAlertIcon />
          <AlertTitle>{{ saveError }}</AlertTitle>
        </Alert>
        <Button size="lg" class="w-full" :disabled="saving" @click="saveProfile">
          <Spinner v-if="saving" data-icon="inline-start" />
          Continue
        </Button>
      </template>

      <template v-else-if="profile">
        <div class="flex flex-col items-center mb-8">
          <Avatar class="size-24 ring-4 ring-primary/20">
            <AvatarImage :src="avatarUrl" :alt="profile.displayName || 'You'" />
            <AvatarFallback>{{ profileInitials }}</AvatarFallback>
          </Avatar>
          <h2 class="text-2xl font-bold mt-4">
            {{ profile.displayName || 'You' }}<span v-if="age">, {{ age }}</span>
          </h2>
          <p class="text-muted-foreground text-center mt-1">{{ profile.bio || 'No bio yet' }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Button
            variant="secondary"
            class="w-full"
            @click="openEdit = true"
          >
            <UserPenIcon data-icon="inline-start" />
            Edit Profile
          </Button>
        </div>
      </template>

      <Alert v-else-if="error" variant="destructive" class="mt-4">
        <CircleAlertIcon />
        <AlertTitle>{{ error }}</AlertTitle>
      </Alert>
    </div>

    <Sheet v-model:open="openEdit">
      <SheetContent side="right" class="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
        </SheetHeader>
        <div class="flex flex-col gap-4 px-4 pb-4">
          <FieldGroup>
            <Field :data-invalid="!!saveError">
              <FieldLabel for="edit-display-name">Display name</FieldLabel>
              <Input
                id="edit-display-name"
                v-model="editForm.displayName"
                :aria-invalid="!!saveError"
              />
            </Field>
            <Field>
              <FieldLabel for="edit-bio">Bio</FieldLabel>
              <Textarea id="edit-bio" v-model="editForm.bio" :rows="4" />
            </Field>
          </FieldGroup>
          <Alert v-if="saveError" variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>{{ saveError }}</AlertTitle>
          </Alert>
          <div class="flex gap-2">
            <Button variant="ghost" class="flex-1" @click="openEdit = false">Cancel</Button>
            <Button class="flex-1" :disabled="saving" @click="saveProfile">
              <Spinner v-if="saving" data-icon="inline-start" />
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { CircleAlertIcon, LogOutIcon, UserIcon, UserPenIcon } from 'lucide-vue-next';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';
import { calcAge } from '~/utils/format';

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

type Profile = {
  userId: string;
  displayName: string | null;
  bio: string | null;
  birthdate: string | null;
  photos: string[];
};

const { client } = useApi();
const authStore = useAuthStore();
const router = useRouter();

const profile = ref<Profile | null>(null);
const needsSetup = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);
const openEdit = ref(false);
const saving = ref(false);
const saveError = ref<string | null>(null);

const editForm = reactive({
  displayName: '',
  bio: '',
});

const avatarUrl = computed(() => profile.value?.photos?.[0] || '');
const age = computed(() => calcAge(profile.value?.birthdate));
const profileInitials = computed(() => {
  const name = profile.value?.displayName?.trim() || 'You';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

async function loadProfile() {
  loading.value = true;
  error.value = null;
  needsSetup.value = false;
  try {
    const result = await authStore.ensureProfile();
    if (result.success && result.profile) {
      profile.value = result.profile;
      editForm.displayName = result.profile.displayName ?? '';
      editForm.bio = result.profile.bio ?? '';
      if (!result.profile.displayName?.trim()) {
        needsSetup.value = true;
      }
      return;
    }

    if (result.error === 'Profile not found') {
      needsSetup.value = true;
      return;
    }

    error.value = result.error ?? 'Could not load profile';
  } catch {
    error.value = 'Could not load profile';
  } finally {
    loading.value = false;
  }
}

async function saveProfile() {
  if (!editForm.displayName.trim()) {
    saveError.value = 'Display name is required';
    return;
  }

  saving.value = true;
  saveError.value = null;
  try {
    const response = await client.profile.updateMe({
      body: {
        displayName: editForm.displayName.trim(),
        bio: editForm.bio.trim() || undefined,
      },
    });
    if (response.status === 200 && response.body) {
      const wasSetup = needsSetup.value;
      profile.value = response.body;
      needsSetup.value = false;
      openEdit.value = false;
      if (wasSetup) {
        await router.push('/');
      }
    } else {
      const message =
        response.body && typeof response.body === 'object' && 'message' in response.body
          ? String((response.body as { message: string }).message)
          : 'Could not save profile';
      saveError.value = message;
    }
  } catch {
    saveError.value = 'Could not save profile';
  } finally {
    saving.value = false;
  }
}

async function handleLogout() {
  await authStore.logout();
  await router.push('/auth/login');
}

onMounted(loadProfile);
</script>
