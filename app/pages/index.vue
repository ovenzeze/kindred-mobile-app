<template>
  <div class="p-4 flex flex-col items-center justify-center h-full text-center">
    <div v-if="loading" class="w-full space-y-4">
      <USkeleton class="w-full aspect-[3/4] rounded-2xl" />
      <div class="flex gap-4 justify-center">
        <USkeleton class="w-16 h-16 rounded-full" />
        <USkeleton class="w-12 h-12 rounded-full" />
        <USkeleton class="w-16 h-16 rounded-full" />
      </div>
    </div>

    <template v-else-if="currentCard">
      <DiscoveryCard
        :name="currentCard.displayName || 'Unknown'"
        :age="currentCard.age ?? 0"
        :bio="currentCard.bio || ''"
        :image-url="currentCard.imageUrl"
        :tags="currentCard.tags"
      />

      <div class="flex gap-4 mt-8">
        <UButton
          icon="i-lucide-x"
          size="xl"
          color="error"
          variant="soft"
          class="rounded-full w-16 h-16 flex justify-center shadow-md active:scale-95 transition-transform"
          :disabled="actionLoading"
          @click="swipe('pass')"
        />
        <UButton
          icon="i-lucide-star"
          size="lg"
          color="info"
          variant="soft"
          class="rounded-full w-12 h-12 flex justify-center mt-2 shadow-sm active:scale-95 transition-transform"
          :disabled="actionLoading"
          @click="swipe('super_like')"
        />
        <UButton
          icon="i-lucide-heart"
          size="xl"
          color="success"
          variant="soft"
          class="rounded-full w-16 h-16 flex justify-center shadow-md active:scale-95 transition-transform"
          :disabled="actionLoading"
          @click="swipe('like')"
        />
      </div>
    </template>

    <div v-else class="flex flex-col items-center text-dimmed">
      <UIcon name="i-lucide-sparkles" class="w-12 h-12 opacity-20" />
      <p class="mt-2">{{ error || 'No more profiles. Check back later!' }}</p>
      <UButton class="mt-4" variant="soft" @click="fetchQueue">Reload</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calcAge } from '~/utils/format';

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

type QueueCard = {
  userId: string;
  displayName: string | null;
  bio: string | null;
  birthdate: string | null;
  imageUrl: string;
  age: number | null;
  tags: string[];
};

const { client } = useApi();

const queue = ref<QueueCard[]>([]);
const currentIndex = ref(0);
const loading = ref(true);
const actionLoading = ref(false);
const error = ref<string | null>(null);

const currentCard = computed(() => queue.value[currentIndex.value] ?? null);

function mapUser(user: {
  userId: string;
  displayName: string | null;
  bio: string | null;
  birthdate: string | null;
  photos: string[];
  gender?: string | null;
}): QueueCard {
  const tags = [user.gender].filter(Boolean) as string[];
  return {
    userId: user.userId,
    displayName: user.displayName,
    bio: user.bio,
    birthdate: user.birthdate,
    imageUrl: user.photos?.[0] ?? '',
    age: calcAge(user.birthdate),
    tags,
  };
}

async function fetchQueue() {
  loading.value = true;
  error.value = null;
  try {
    const response = await client.discovery.getQueue({ query: { limit: 20 } });
    if (response.status === 200 && response.body?.users) {
      queue.value = response.body.users.map(mapUser);
      currentIndex.value = 0;
    } else {
      const message =
        response.body && typeof response.body === 'object' && 'message' in response.body
          ? String((response.body as { message: string }).message)
          : null;
      error.value = message || 'Could not load discovery queue';
      queue.value = [];
    }
  } catch {
    error.value = 'Could not load discovery queue';
    queue.value = [];
  } finally {
    loading.value = false;
  }
}

function advanceCard() {
  if (currentIndex.value < queue.value.length - 1) {
    currentIndex.value += 1;
  } else {
    queue.value = [];
    currentIndex.value = 0;
  }
}

async function swipe(action: 'like' | 'pass' | 'super_like') {
  const card = currentCard.value;
  if (!card || actionLoading.value) return;

  actionLoading.value = true;
  try {
    await client.discovery.swipe({
      body: {
        targetUserId: card.userId,
        action,
      },
    });
    advanceCard();
  } finally {
    actionLoading.value = false;
  }
}

onMounted(fetchQueue);
</script>
