<template>
  <div class="flex flex-col h-full bg-transparent">
    <AppHeader>
      <template #left>
        <div class="flex flex-col">
          <p class="kindred-section-kicker opacity-60">Identity</p>
          <h1 class="kindred-section-title -mt-1 font-black tracking-tighter">Profile</h1>
        </div>
      </template>
      <template #right>
        <Button
          variant="outline"
          size="icon"
          class="size-11 rounded-full border-white/10 bg-white/5 shadow-none backdrop-blur-xl ring-1 ring-white/10"
          aria-label="Log out"
          @click="handleLogout"
        >
          <LogOutIcon class="size-5 text-foreground/80" />
        </Button>
      </template>
    </AppHeader>

    <div class="kindred-page flex-1 overflow-y-auto gap-8">
      <div v-if="loading" class="flex flex-col gap-8">
        <Skeleton class="mx-auto size-32 rounded-full" />
        <div class="space-y-4">
          <Skeleton class="mx-auto h-10 w-48 rounded-full" />
          <Skeleton class="mx-auto h-4 w-64 rounded-full" />
        </div>
      </div>

      <template v-else-if="needsSetup">
        <EmptyState
          :icon="UserIcon"
          title="Begin your journey"
          description="Setting up your profile helps us find the most compatible people for you."
        />
        <FieldGroup class="px-2">
          <Field :data-invalid="!!saveError">
            <FieldLabel for="setup-display-name">Display name</FieldLabel>
            <Input
              id="setup-display-name"
              v-model="editForm.displayName"
              placeholder="Your name"
              class="rounded-[1.25rem] bg-white/10 dark:bg-white/5 border-none ring-1 ring-white/10 h-12"
              :aria-invalid="!!saveError"
            />
          </Field>
        </FieldGroup>
        <Alert v-if="saveError" variant="destructive" class="rounded-[1.25rem]">
          <CircleAlertIcon />
          <AlertTitle>{{ saveError }}</AlertTitle>
        </Alert>
        <Button size="lg" class="w-full rounded-full h-14 font-black shadow-xl shadow-primary/20" :disabled="saving" @click="saveProfile">
          <Spinner v-if="saving" data-icon="inline-start" />
          Continue
        </Button>
      </template>

      <template v-else-if="profile">
        <div class="flex flex-col items-center">
          <Avatar class="size-32 bg-primary/5 ring-4 ring-white/20 shadow-2xl transition-transform duration-500 hover:scale-105">
            <AvatarImage :src="avatarUrl" :alt="profile.displayName || 'You'" class="object-cover" />
            <AvatarFallback class="bg-primary/10 text-3xl font-black text-primary">{{ profileInitials }}</AvatarFallback>
          </Avatar>
          
          <h2 class="mt-8 text-4xl font-black tracking-tighter kindred-gradient-text text-center">
            {{ profile.displayName || 'You' }}<span v-if="age" class="text-foreground/40 font-bold">, {{ age }}</span>
          </h2>
          
          <p class="mt-4 max-w-xs text-center text-[0.95rem] font-medium leading-relaxed text-muted-foreground/80">
            {{ profile.bio || 'Sharing a bit about myself soon...' }}
          </p>

          <div class="mt-8 flex w-full flex-col gap-4">
            <Button
              variant="outline"
              class="h-14 w-full rounded-full border-white/10 bg-white/5 font-black uppercase tracking-widest text-[0.7rem] shadow-xl shadow-black/5 ring-1 ring-white/10"
              @click="openEdit = true"
            >
              <UserPenIcon data-icon="inline-start" class="size-4" />
              Edit My Profile
            </Button>
          </div>
        </div>

        <div class="mt-12 space-y-8">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Profile Preview</h3>
            <Badge variant="outline" class="border-primary/10 bg-primary/5 text-primary/60 font-black text-[0.6rem] uppercase tracking-wider">Verified</Badge>
          </div>
          <ProfileDetails :fields="profile.fields || []" />
        </div>
      </template>

      <Alert v-else-if="error" variant="destructive" class="rounded-2xl">
        <CircleAlertIcon />
        <AlertTitle>{{ error }}</AlertTitle>
      </Alert>
    </div>


      <Sheet v-model:open="openEdit">
      <SheetContent side="right" class="w-full max-w-md border-none p-0">
        <div class="flex h-full flex-col bg-background/95 backdrop-blur-xl">
          <SheetHeader class="p-6 border-b border-white/10">
            <SheetTitle class="text-xl font-bold">Edit Profile</SheetTitle>
          </SheetHeader>
          <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <FieldGroup>
              <Field :data-invalid="!!saveError">
                <FieldLabel for="edit-display-name">Display Name</FieldLabel>
                <Input
                  id="edit-display-name"
                  v-model="editForm.displayName"
                  class="rounded-2xl"
                  :aria-invalid="!!saveError"
                />
              </Field>
              <Field>
                <FieldLabel for="edit-bio">Bio</FieldLabel>
                <Textarea id="edit-bio" v-model="editForm.bio" :rows="4" class="rounded-2xl" />
              </Field>
            </FieldGroup>
            <Alert v-if="saveError" variant="destructive" class="rounded-2xl">
              <CircleAlertIcon />
              <AlertTitle>{{ saveError }}</AlertTitle>
            </Alert>
          </div>
          <div class="p-6 border-t border-white/10 bg-background/40 flex gap-3">
            <Button variant="ghost" class="flex-1 rounded-full font-bold" @click="openEdit = false">Cancel</Button>
            <Button class="flex-1 rounded-full font-bold shadow-lg shadow-primary/20" :disabled="saving" @click="saveProfile">
              <Spinner v-if="saving" data-icon="inline-start" />
              Save Changes
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
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';
import ProfileDetails from '~/components/ProfileDetails.vue';
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
  fields?: any[];
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
