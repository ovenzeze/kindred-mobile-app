<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <h1 class="text-xl font-bold text-highlighted">Profile</h1>
      </template>
      <template #right>
        <UButton
          icon="i-lucide-log-out"
          variant="ghost"
          color="neutral"
          aria-label="Log out"
          @click="handleLogout"
        />
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="loading" class="space-y-4">
        <USkeleton class="w-24 h-24 rounded-full mx-auto" />
        <USkeleton class="h-6 w-40 mx-auto" />
        <USkeleton class="h-4 w-56 mx-auto" />
      </div>

      <template v-else-if="profile">
        <div class="flex flex-col items-center mb-8">
          <UAvatar
            :src="avatarUrl"
            size="3xl"
            class="ring-4 ring-primary-500/20"
          />
          <h2 class="text-2xl font-bold mt-4">
            {{ profile.displayName || 'You' }}<span v-if="age">, {{ age }}</span>
          </h2>
          <p class="text-muted text-center mt-1">{{ profile.bio || 'No bio yet' }}</p>
        </div>

        <div class="space-y-2">
          <UButton
            label="Edit Profile"
            icon="i-lucide-user-pen"
            block
            variant="soft"
            color="neutral"
            @click="openEdit = true"
          />
        </div>
      </template>

      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        :title="error"
        class="mt-4"
      />
    </div>

    <USlideover v-model:open="openEdit">
      <template #content>
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-highlighted">Edit profile</h3>
          <UFormField label="Display name">
            <UInput v-model="editForm.displayName" class="w-full" />
          </UFormField>
          <UFormField label="Bio">
            <UTextarea v-model="editForm.bio" class="w-full" :rows="4" />
          </UFormField>
          <UAlert v-if="saveError" color="error" variant="soft" :title="saveError" />
          <div class="flex gap-2">
            <UButton variant="ghost" block @click="openEdit = false">Cancel</UButton>
            <UButton block :loading="saving" @click="saveProfile">Save</UButton>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
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

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    const response = await client.profile.getMe();
    if (response.status === 200 && response.body) {
      profile.value = response.body;
      editForm.displayName = response.body.displayName ?? '';
      editForm.bio = response.body.bio ?? '';
    } else {
      error.value = 'Could not load profile';
    }
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
      profile.value = response.body;
      openEdit.value = false;
    } else {
      saveError.value = 'Could not save profile';
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
