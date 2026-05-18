import { defineStore } from 'pinia';

export type CachedUser = {
  userId: string;
  displayName: string | null;
  bio: string | null;
  birthdate: string | null;
  gender: string | null;
  photos: string[];
};

export const useUserStore = defineStore('user', {
  state: () => ({
    cache: {} as Record<string, CachedUser>,
    inflight: {} as Record<string, Promise<CachedUser | null>>,
  }),

  getters: {
    getById: (state) => (userId: string) => state.cache[userId] ?? null,
    displayName: (state) => (userId: string) => state.cache[userId]?.displayName ?? 'Unknown',
    photoUrl: (state) => (userId: string) => state.cache[userId]?.photos?.[0] ?? '',
  },

  actions: {
    prime(user: CachedUser) {
      this.cache[user.userId] = user;
    },

    async fetchUser(userId: string): Promise<CachedUser | null> {
      if (this.cache[userId]) return this.cache[userId];
      if (this.inflight[userId]) return this.inflight[userId];

      const promise = (async () => {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();
        const response = await client.profile.getUser({ params: { id: userId } });
        if (response.status === 200 && response.body) {
          const user: CachedUser = {
            userId: response.body.userId,
            displayName: response.body.displayName,
            bio: response.body.bio,
            birthdate: response.body.birthdate,
            gender: response.body.gender,
            photos: response.body.photos ?? [],
          };
          this.cache[userId] = user;
          return user;
        }
        return null;
      })();

      this.inflight[userId] = promise;
      try {
        return await promise;
      } finally {
        delete this.inflight[userId];
      }
    },

    async fetchUsers(userIds: string[]) {
      const unique = [...new Set(userIds)].filter((id) => id && !this.cache[id]);
      await Promise.all(unique.map((id) => this.fetchUser(id)));
    },
  },
});
