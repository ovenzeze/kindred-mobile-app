<template>
  <div class="flex flex-col h-full bg-transparent">
    <AppHeader>
      <template #left>
        <div class="flex flex-col">
          <p class="kindred-section-kicker opacity-60">Kindred</p>
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
          <ProfileDetails :fields="profile.fields || []" :photos="profile.photos || []" />
        </div>
      </template>

      <Alert v-else-if="error" variant="destructive" class="rounded-2xl">
        <CircleAlertIcon />
        <AlertTitle>{{ error }}</AlertTitle>
      </Alert>
    </div>


      <Sheet v-model:open="openEdit">
      <SheetContent side="right" class="w-full max-w-md border-none p-0">
        <div class="flex h-full flex-col bg-background/95 backdrop-blur-3xl">
          <SheetHeader class="p-6 border-b border-white/5 sticky top-0 z-10 bg-background/50 backdrop-blur-md">
            <SheetTitle class="text-2xl font-black tracking-tighter">Edit Profile</SheetTitle>
          </SheetHeader>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
            <!-- Photos Section -->
            <section class="space-y-4">
              <div class="flex items-center justify-between px-1">
                <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">My Photos</h3>
                <span class="text-[0.6rem] font-bold text-primary/60">{{ photos.length }}/6</span>
              </div>
              <PhotoGrid 
                :photos="photos" 
                :uploading="uploadingPhoto"
                @upload="handlePhotoUpload"
                @delete="handlePhotoDelete"
              />
            </section>

            <!-- Basic Info -->
            <section class="space-y-6">
              <div class="flex items-center px-1">
                <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Core Identity</h3>
              </div>
              <FieldGroup>
                <Field :data-invalid="!!saveError">
                  <FieldLabel for="edit-display-name">Display Name</FieldLabel>
                  <Input
                    id="edit-display-name"
                    v-model="editForm.displayName"
                    class="h-12 rounded-[1.25rem] bg-white/10 border-none ring-1 ring-white/10 focus-visible:ring-primary/30"
                    :aria-invalid="!!saveError"
                  />
                </Field>
                <Field>
                  <FieldLabel for="edit-bio">Bio</FieldLabel>
                  <Textarea 
                    id="edit-bio" 
                    v-model="editForm.bio" 
                    :rows="4" 
                    placeholder="Tell your story..."
                    class="rounded-[1.5rem] bg-white/10 border-none ring-1 ring-white/10 focus-visible:ring-primary/30" 
                  />
                </Field>
              </FieldGroup>
            </section>

            <!-- Dynamic Field Groups -->
            <section v-for="(fields, group) in PROFILE_FIELD_GROUPS" :key="group" class="space-y-6">
              <div class="flex items-center px-1">
                <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50 capitalize">{{ group }}</h3>
              </div>
              <FieldGroupEditor 
                :fields="Array.from(fields)" 
                v-model="fieldValues[group]" 
              />
            </section>
          </div>

          <!-- Sticky Footer -->
          <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-background/80 backdrop-blur-xl flex gap-3">
            <Button variant="ghost" class="flex-1 rounded-full font-bold h-12" @click="openEdit = false">Cancel</Button>
            <Button class="flex-1 rounded-full font-black h-12 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary to-primary/80" :disabled="saving" @click="saveProfile">
              <Spinner v-if="saving" data-icon="inline-start" />
              Save Everything
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
import PhotoGrid from '~/components/PhotoGrid.vue';
import FieldGroupEditor from '~/components/FieldGroupEditor.vue';
import { PROFILE_FIELD_GROUPS } from '~/utils/profile-fields';
import { calcAge } from '~/utils/format';
import { compressImage } from '~/utils/image';

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

// Photo Management
const photos = ref<any[]>([]);
const uploadingPhoto = ref(false);

async function loadPhotos() {
  const res = await client.albums.listAlbums({});
  if (res.status === 200 && res.body.albums.length > 0) {
    const albumId = res.body.albums[0].id;
    const photoRes = await client.albums.listPhotos({ params: { id: albumId } });
    if (photoRes.status === 200) {
      photos.value = photoRes.body.photos;
    }
  } else if (res.status === 200) {
    // Create default album if none
    await client.albums.createAlbum({ body: { title: 'Primary', visibility: 'public' } });
    loadPhotos();
  }
}

async function handlePhotoUpload(input: File | File[]) {
  const files = Array.isArray(input) ? input : [input];
  uploadingPhoto.value = true;
  try {
    const albums = await client.albums.listAlbums({});
    if (albums.status !== 200 || albums.body.albums.length === 0) return;
    const albumId = albums.body.albums[0].id;

    await Promise.all(files.map(async (file) => {
      try {
        // 1. Compress image (max 1200px, 0.8 quality)
        const compressedFile = await compressImage(file);
        
        // 2. Get pre-signed URL
        const res = await client.albums.getUploadUrl({ 
          params: { id: albumId },
          body: { contentType: compressedFile.type }
        });

        if (res.status === 200) {
          const { uploadUrl, objectKey, publicUrl } = res.body;
          // 3. Direct upload to R2
          await fetch(uploadUrl, { 
            method: 'PUT', 
            body: compressedFile, 
            headers: { 'Content-Type': compressedFile.type } 
          });
          
          const photoUrl = publicUrl || uploadUrl;
          // 4. Confirm to backend
          await client.albums.confirmUpload({ 
            params: { id: albumId }, 
            body: { objectKey, url: photoUrl } 
          });
        }
      } catch (e) {
        console.error('Failed to upload photo:', file.name, e);
      }
    }));

    await loadPhotos();
  } finally {
    uploadingPhoto.value = false;
  }
}

async function handlePhotoDelete(photoId: string) {
  const albums = await client.albums.listAlbums({});
  if (albums.status !== 200 || albums.body.albums.length === 0) return;
  await client.albums.deletePhoto({ params: { id: albums.body.albums[0].id, photoId } });
  await loadPhotos();
}

// Field Management
const fieldValues = reactive<Record<string, any>>({
  basics: {},
  work: {},
  education: {},
  about: {},
  appearance: {}
});

async function loadProfile() {
  loading.value = true;
  error.value = null;
  needsSetup.value = false;
  try {
    const [profileRes, fieldsRes] = await Promise.all([
      authStore.ensureProfile(),
      client.profileFields.getMyFields({})
    ]);

    if (profileRes.success && profileRes.profile) {
      profile.value = profileRes.profile;
      editForm.displayName = profileRes.profile.displayName ?? '';
      editForm.bio = profileRes.profile.bio ?? '';
      if (!profileRes.profile.displayName?.trim()) {
        needsSetup.value = true;
      }
    }

    if (fieldsRes.status === 200) {
      fieldsRes.body.fields.forEach(f => {
        fieldValues[f.fieldKey] = f.value ?? {};
      });
    }

    await loadPhotos();
  } finally {
    loading.value = false;
  }
}

async function saveFieldGroup(key: string) {
  saving.value = true;
  try {
    await client.profileFields.upsertField({
      body: {
        fieldKey: key,
        value: fieldValues[key]
      }
    });
  } finally {
    saving.value = false;
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
    // Save main profile
    const response = await client.profile.updateMe({
      body: {
        displayName: editForm.displayName.trim(),
        bio: editForm.bio.trim() || undefined,
      },
    });

    // Save all field groups
    await Promise.all(Object.keys(fieldValues).map(key => saveFieldGroup(key)));

    if (response.status === 200 && response.body) {
      const wasSetup = needsSetup.value;
      profile.value = response.body;
      needsSetup.value = false;
      openEdit.value = false;
      if (wasSetup) {
        await router.push('/');
      }
    }
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
