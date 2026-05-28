<template>
  <div class="flex flex-col h-full bg-transparent">
    <!-- Header with Back Button and User Info -->
    <header class="sticky top-0 z-20 flex h-20 items-center border-b border-white/5 bg-background/30 px-4 backdrop-blur-xl">
      <Button variant="ghost" size="icon" class="rounded-full hover:bg-white/10" @click="router.back()">
        <ChevronLeftIcon class="size-6" />
      </Button>

      <div v-if="otherUser" class="ml-2 flex items-center gap-3">
        <Avatar class="size-11 border-2 border-white/10 shadow-lg">
          <AvatarImage :src="userStore.photoUrl(otherUser.userId)" />
          <AvatarFallback class="font-bold">{{ initials }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col">
          <h2 class="text-base font-black tracking-tight leading-none">{{ otherUser.displayName }}</h2>
          <div class="mt-1 flex items-center gap-1.5">
            <div class="size-1.5 rounded-full bg-success animate-pulse" />
            <span class="text-[0.65rem] font-black uppercase tracking-widest text-success/80">Online Now</span>
          </div>
        </div>
      </div>
      <div v-else class="ml-2 flex items-center gap-3">
        <Skeleton class="size-10 rounded-full" />
        <div class="space-y-1.5">
          <Skeleton class="h-3 w-24 rounded-full" />
          <Skeleton class="h-2 w-12 rounded-full" />
        </div>
      </div>
    </header>

    <!-- Message List -->
    <div ref="scrollContainer" class="kindred-page flex-1 overflow-y-auto !gap-4 !pb-10 pt-4">
      <div v-if="loading" class="flex flex-col gap-4">
        <div v-for="i in 6" :key="i" :class="['flex', i % 2 === 0 ? 'justify-end' : 'justify-start']">
          <Skeleton :class="['h-10 w-2/3 rounded-2xl', i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none']" />
        </div>
      </div>

      <template v-else>
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex w-full flex-col"
          :class="msg.senderId === currentUserId ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] rounded-[1.5rem] px-4 py-3 shadow-md"
            :class="[
              msg.senderId === currentUserId
                ? 'bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground rounded-tr-none shadow-primary/10'
                : 'kindred-glass-strong !bg-white/60 dark:!bg-white/5 text-foreground rounded-tl-none border-none ring-1 ring-white/10'
            ]"
          >
            <p class="text-[0.95rem] leading-relaxed font-medium">{{ msg.body }}</p>
          </div>
          <span class="mt-2 px-2 text-[0.6rem] font-black text-muted-foreground/40 uppercase tracking-[0.1em]">
            {{ formatTime(msg.createdAt) }}
          </span>
        </div>
      </template>
    </div>

    <!-- Message Input -->
    <div class="border-t border-white/5 bg-background/20 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-2xl">
      <div class="mx-auto flex max-w-sm items-end gap-3">
        <div class="relative flex-1">
          <Textarea
            v-model="newMessage"
            placeholder="Type a message..."
            class="min-h-[3rem] max-h-32 resize-none rounded-[1.75rem] border-none bg-white/10 dark:bg-white/5 py-3.5 pl-5 pr-12 ring-1 ring-white/10 focus-visible:ring-primary/30 text-[0.95rem] font-medium"
            :rows="1"
            @keydown.enter.prevent="send"
          />
          <Button
            variant="ghost"
            size="icon"
            class="absolute bottom-1 right-1 size-10 rounded-full text-muted-foreground/60 hover:text-primary hover:bg-transparent"
          >
            <SmileIcon class="size-6" />
          </Button>
        </div>
        <Button
          size="icon"
          class="size-12 shrink-0 rounded-full shadow-xl shadow-primary/25 bg-gradient-to-br from-primary to-primary/80 border-none"
          :disabled="!newMessage.trim() || sending"
          @click="send"
        >
          <SendIcon v-if="!sending" class="size-5" />
          <Spinner v-else class="size-5" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, SendIcon, SmileIcon } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const { client } = useApi();
const userStore = useUserStore();
const authStore = useAuthStore();

const matchId = computed(() => route.params.id as string);
const currentUserId = computed(() => authStore.user?.id);

const messages = ref<any[]>([]);
const otherUser = ref<any>(null);
const loading = ref(true);
const sending = ref(false);
const newMessage = ref('');
const scrollContainer = ref<HTMLElement | null>(null);

const initials = computed(() => {
  if (!otherUser.value?.displayName) return '?';
  return otherUser.value.displayName.charAt(0).toUpperCase();
});

async function loadChat() {
  loading.value = true;
  try {
    const [msgRes, matchesRes] = await Promise.all([
      client.chat.listMessages({ params: { matchId: matchId.value } }),
      client.matches.list({ query: {} })
    ]);

    if (msgRes.status === 200) {
      messages.value = msgRes.body.messages;
    }

    // Find the other user ID from matches
    if (matchesRes.status === 200) {
      const match = matchesRes.body.matches.find((m: any) => m.id === matchId.value);
      if (match) {
        await userStore.fetchUsers([match.otherUserId]);
        const user = userStore.users.find(u => u.userId === match.otherUserId);
        if (user) otherUser.value = user;
      }
    }
    
    scrollToBottom();
  } finally {
    loading.value = false;
  }
}

async function send() {
  if (!newMessage.value.trim() || sending.value) return;
  
  sending.value = true;
  const body = newMessage.value.trim();
  newMessage.value = '';

  try {
    const res = await client.chat.sendMessage({
      params: { matchId: matchId.value },
      body: { body }
    });
    
    if (res.status === 201) {
      messages.value.push(res.body);
      scrollToBottom();
    }
  } finally {
    sending.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

onMounted(loadChat);
</script>

<style scoped>
/* Custom hide scrollbar */
.overflow-y-auto {
  scrollbar-width: none;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>
