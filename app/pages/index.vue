<template>
  <div class="flex h-full flex-col">
    <AppHeader />

    <div class="kindred-page flex-1 overflow-y-auto">
      <div v-if="loading" class="flex w-full flex-col gap-6">
        <Skeleton class="aspect-[3/4] w-full rounded-[2.5rem]" />
        <div class="flex justify-center gap-6">
          <Skeleton class="size-16 rounded-full" />
          <Skeleton class="size-14 rounded-full" />
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
          @show-details="showProfileDetail = true"
        />

        <div class="mt-8 flex items-center justify-center gap-6">
          <div @click="swipe('pass')" class="cursor-pointer" role="button" tabindex="0">
          <Button
            size="icon-lg"
            variant="outline"
            class="size-16 rounded-full border-white/10 bg-white/5 text-destructive shadow-xl shadow-black/5 backdrop-blur-3xl ring-1 ring-white/10 active:scale-90 pointer-events-none"
            aria-label="Pass"
            :disabled="actionLoading"
          >
            <XIcon class="size-7" />
          </Button>
          </div>
          <div @click="swipe('super_like')" class="cursor-pointer mt-3" role="button" tabindex="0">
          <Button
            size="icon-lg"
            variant="outline"
            class="mt-3 size-14 rounded-full border-white/10 bg-white/10 text-warning shadow-lg shadow-black/5 backdrop-blur-3xl ring-1 ring-white/10 active:scale-90 pointer-events-none"
            aria-label="Super like"
            :disabled="actionLoading"
          >
            <StarIcon class="size-6 fill-current" />
          </Button>
          </div>
          <div @click="swipe('like')" class="cursor-pointer" role="button" tabindex="0">
          <Button
            size="icon-lg"
            class="size-16 rounded-full border-primary/20 bg-primary/15 text-primary shadow-xl shadow-primary/10 backdrop-blur-3xl ring-1 ring-primary/20 active:scale-90 pointer-events-none"
            aria-label="Like"
            :disabled="actionLoading"
          >
            <HeartIcon class="size-7 fill-current" />
          </Button>
          </div>
        </div>

        <!-- Profile Details Drawer -->
        <Drawer v-model:open="showProfileDetail">
          <DrawerContent class="kindred-glass-strong !bg-white/60 dark:!bg-black/40">
            <div class="mx-auto mt-4 h-1.5 w-12 rounded-full bg-foreground/10 shrink-0" />
            <DrawerHeader class="flex flex-col items-center gap-1.5 pb-10 pt-6">
              <DrawerTitle class="text-4xl font-black tracking-tighter kindred-gradient-text">{{ currentCard.displayName }}</DrawerTitle>
              <div class="flex items-center gap-3">
                <Badge variant="outline" class="border-primary/20 bg-primary/5 text-primary font-bold">
                  {{ currentCard.age }} years old
                </Badge>
                <div class="size-1 rounded-full bg-foreground/10" />
                <span class="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                  {{ currentCard.tags[0] || 'Verified Member' }}
                </span>
              </div>
            </DrawerHeader>
            <div class="overflow-y-auto px-6 pb-16">
              <ProfileDetails :fields="currentCard.fields" />
            </div>
          </DrawerContent>
        </Drawer>
      </template>

        <EmptyState
        v-else
        :icon="SparklesIcon"
        title="All caught up!"
        description="Check back later for new profiles or try adjusting your filters."
        action-label="Reload Queue"
        @action="fetchQueue"
        />
        </div>

        <!-- Match Success Overlay -->

      <MatchOverlay
      :is-open="showMatchOverlay"
      :matched-user-name="matchData.name"
      :matched-user-photo="matchData.photo"
      :current-user-photo="currentUserPhoto"
      @close="showMatchOverlay = false"
      @chat="goToChat"
      />
      </div>
      </template>

      <script setup lang="ts">
      import { HeartIcon, SparklesIcon, StarIcon, XIcon } from 'lucide-vue-next';
      import { Button } from '~/components/ui/button';
      import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '~/components/ui/drawer';
      import { Skeleton } from '~/components/ui/skeleton';
      import MatchOverlay from '~/components/MatchOverlay.vue';
      import ProfileDetails from '~/components/ProfileDetails.vue';
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
        fields: any[];
      };

      const { client } = useApi();
      const router = useRouter();
      const authStore = useAuthStore();

      const queue = ref<QueueCard[]>([]);
      const currentIndex = ref(0);
      const loading = ref(true);
      const actionLoading = ref(false);
      const error = ref<string | null>(null);

      // Profile Detail State
      const showProfileDetail = ref(false);

      // Match Overlay State
      const showMatchOverlay = ref(false);
      const matchData = reactive({
        id: '',
        name: '',
        photo: ''
      });

      const currentUserPhoto = computed(() => authStore.userProfile?.photos?.[0] || '');

      const currentCard = computed(() => queue.value[currentIndex.value] ?? null);

      function mapUser(user: {
        userId: string;
        displayName: string | null;
        bio: string | null;
        birthdate: string | null;
        photos: string[];
        gender?: string | null;
        fields?: any[];
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
          fields: user.fields ?? [],
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
      fetchQueue();
      }
      }

      async function swipe(action: 'like' | 'pass' | 'super_like') {
      const card = currentCard.value;
      if (!card || actionLoading.value) return;

      actionLoading.value = true;
      try {
      const res = await client.discovery.swipe({
      body: {
        targetUserId: card.userId,
        action,
      },
      });

      // Check for a match
      if (res.status === 200 && res.body.isMatch && res.body.matchId) {
      matchData.id = res.body.matchId;
      matchData.name = card.displayName || 'Someone';
      matchData.photo = card.imageUrl;
      showMatchOverlay.value = true;
      }

      advanceCard();
      } catch (err) {
      console.error('Swipe failed:', err);
      } finally {
      actionLoading.value = false;
      }
      }

      function goToChat() {
      showMatchOverlay.value = false;
      router.push(`/chat/${matchData.id}`);
      }

      onMounted(() => {
      authStore.ensureProfile();
      fetchQueue();
      });
      </script>

