<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <h1 class="text-xl font-bold text-highlighted">Messages</h1>
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="p-4 space-y-3">
        <USkeleton v-for="i in 4" :key="i" class="h-20 w-full" />
      </div>

      <div v-else-if="chats.length > 0">
        <MatchCell
          v-for="chat in chats"
          :key="chat.id"
          v-bind="chat"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center h-64 text-dimmed">
        <UIcon name="i-lucide-message-circle" class="w-12 h-12 opacity-20" />
        <p class="mt-2">{{ error || 'No messages yet.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

async function loadChats() {
  loading.value = true;
  error.value = null;
  try {
    const [conversationsRes, matchesRes] = await Promise.all([
      client.chat.listConversations(),
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
      .map((c) => matchMap.get(c.matchId))
      .filter((id): id is string => !!id);

    await userStore.fetchUsers(otherUserIds);

    chats.value = conversations.map((c) => {
      const otherUserId = matchMap.get(c.matchId);
      const last = c.lastMessage;
      return {
        id: c.matchId,
        name: otherUserId ? userStore.displayName(otherUserId) : 'Unknown',
        imageUrl: otherUserId ? userStore.photoUrl(otherUserId) : '',
        lastMessage: last?.body ?? 'Start the conversation',
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
