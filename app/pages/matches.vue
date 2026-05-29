<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <div class="flex flex-col">
          <p class="kindred-section-kicker">Kindred</p>
          <h1 class="kindred-section-title -mt-0.5">Matches</h1>
        </div>
      </template>
    </AppHeader>

    <div class="kindred-page flex-1 overflow-y-auto">
      <div v-if="loading" class="flex flex-col gap-4">
        <Skeleton v-for="i in 5" :key="i" class="h-24 w-full rounded-[1.5rem]" />
      </div>

      <div v-else-if="matches.length > 0" class="flex flex-col gap-3.5">
        <MatchCell
          v-for="match in matches"
          :key="match.id"
          v-bind="match"
        />
      </div>

      <EmptyState
        v-else
        :icon="HeartIcon"
        title="Find your spark"
        description="Matches will appear here once you both like each other. Keep exploring to find someone special."
        action-label="Start Exploring"
        @action="router.push('/')"
      />
      </div>
      </div>
      </template>

      <script setup lang="ts">
      import { HeartIcon } from 'lucide-vue-next';
      import { Skeleton } from '~/components/ui/skeleton';
      import EmptyState from '~/components/EmptyState.vue';
      import { formatRelativeTime } from '~/utils/format';


definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

type MatchRow = {
  id: string;
  name: string;
  imageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
};

const { client } = useApi();
const userStore = useUserStore();

const matches = ref<MatchRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadMatches() {
  loading.value = true;
  error.value = null;
  try {
    const response = await client.matches.list({ query: {} });
    if (response.status !== 200 || !response.body?.matches) {
      const message =
        response.body && typeof response.body === 'object' && 'message' in response.body
          ? String((response.body as { message: string }).message)
          : null;
      error.value = message || 'Could not load matches';
      matches.value = [];
      return;
    }

    const rows = response.body.matches;
    await userStore.fetchUsers(rows.map((m) => m.otherUserId));

    matches.value = rows.map((m) => ({
      id: m.id,
      name: userStore.displayName(m.otherUserId),
      imageUrl: userStore.photoUrl(m.otherUserId),
      lastMessage: 'New match',
      lastMessageTime: formatRelativeTime(m.matchedAt),
      unreadCount: 0,
    }));
  } catch {
    error.value = 'Could not load matches';
    matches.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadMatches);
</script>
