<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <div class="flex flex-col">
          <p class="kindred-section-kicker">Kindred</p>
          <h1 class="kindred-section-title -mt-0.5">Messages</h1>
        </div>
      </template>
    </AppHeader>

    <div class="kindred-page flex-1 overflow-y-auto">
      <div v-if="loading" class="flex flex-col gap-4">
        <Skeleton v-for="i in 5" :key="i" class="h-24 w-full rounded-[1.5rem]" />
      </div>

      <div v-else-if="chats.length > 0" class="flex flex-col gap-3.5">
        <MatchCell
          v-for="chat in chats"
          :key="chat.id"
          v-bind="chat"
        />
      </div>

      <EmptyState
        v-else
        :icon="MessageCircleIcon"
        title="No active chats"
        description="Go to your matches to start a conversation with your connections."
        action-label="View Matches"
        @action="router.push('/matches')"
      />
      </div>
      </div>
      </template>

      <script setup lang="ts">
      import { MessageCircleIcon } from 'lucide-vue-next';
      import { Skeleton } from '~/components/ui/skeleton';
      import EmptyState from '~/components/EmptyState.vue';
      import { formatRelativeTime } from '~/utils/format';


definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

type ChatRow = {
  id: string;
  name: string;
  imageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
};

const { client } = useApi();
const userStore = useUserStore();

const chats = ref<ChatRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

/** Filter out dev seed content from message previews. */
function sanitizeLastMessage(body: string | null | undefined): string | null {
  if (!body) return null;
  if (body.startsWith('[kindred-dev-seed]')) return null;
  return body;
}

async function loadChats() {
  loading.value = true;
  error.value = null;
  try {
    const [conversationsRes, matchesRes] = await Promise.all([
      client.chat.listConversations({}),
      client.matches.list({ query: {} }),
    ]);

    if (conversationsRes.status !== 200 || !conversationsRes.body?.conversations) {
      error.value = 'Could not load conversations';
      chats.value = [];
      return;
    }

    const matchMap = new Map<string, string>();
    if (matchesRes.status === 200 && matchesRes.body?.matches) {
      for (const match of matchesRes.body.matches) {
        matchMap.set(match.id, match.otherUserId);
      }
    }

    const conversations = conversationsRes.body.conversations;
    const otherUserIds = conversations
      .map((c: any) => matchMap.get(c.matchId))
      .filter((id): id is string => !!id);

    await userStore.fetchUsers(otherUserIds);

    chats.value = conversations.map((c: any) => {
      const otherUserId = matchMap.get(c.matchId);
      const last = c.lastMessage;
      return {
        id: c.matchId,
        name: otherUserId ? userStore.displayName(otherUserId) : 'Unknown',
        imageUrl: otherUserId ? userStore.photoUrl(otherUserId) : '',
        lastMessage: sanitizeLastMessage(last?.body) || 'Start the conversation',
        lastMessageTime: last?.createdAt ? formatRelativeTime(last.createdAt) : '',
        unreadCount: 0,
      };
    });
  } catch {
    error.value = 'Could not load conversations';
    chats.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadChats);
</script>
