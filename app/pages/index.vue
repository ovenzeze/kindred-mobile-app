<template>
  <div class="flex h-full flex-col">
    <AppHeader />

    <div class="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div v-if="loading" class="flex w-full flex-col gap-4">
        <Skeleton class="w-full aspect-[3/4] rounded-2xl" />
        <div class="flex gap-4 justify-center">
          <Skeleton class="size-16 rounded-full" />
          <Skeleton class="size-12 rounded-full" />
          <Skeleton class="size-16 rounded-full" />
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
          <Button
            size="icon-lg"
            variant="destructive"
            class="size-16 rounded-full shadow-md active:scale-95"
            aria-label="Pass"
            :disabled="actionLoading"
            @click="swipe('pass')"
          >
            <XIcon />
          </Button>
          <Button
            size="icon-lg"
            variant="outline"
            class="mt-2 size-12 rounded-full border-info/30 bg-info/10 text-info shadow-sm hover:bg-info/20 active:scale-95"
            aria-label="Super like"
            :disabled="actionLoading"
            @click="swipe('super_like')"
          >
            <StarIcon />
          </Button>
          <Button
            size="icon-lg"
            variant="outline"
            class="size-16 rounded-full border-success/30 bg-success/10 text-success shadow-md hover:bg-success/20 active:scale-95"
            aria-label="Like"
            :disabled="actionLoading"
            @click="swipe('like')"
          >
            <HeartIcon />
          </Button>
        </div>
      </template>

      <div v-else class="flex flex-col items-center text-muted-foreground">
        <SparklesIcon class="size-12 opacity-20" />
        <p class="mt-2">{{ error || 'No more profiles. Check back later!' }}</p>
        <Button class="mt-4" variant="secondary" @click="fetchQueue">Reload</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, SparklesIcon, StarIcon, XIcon } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
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
