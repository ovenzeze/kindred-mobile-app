import { defineStore } from 'pinia';
import { z } from 'zod';

// Session schema based on API contract
const SessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  userId: z.string().uuid(),
});

export type Session = z.infer<typeof SessionSchema>;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as string | null,
    session: null as Session | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.session && !!state.user,
    accessToken: (state) => state.session?.accessToken || null,
  },

  actions: {
    setSession(session: Session, userId: string) {
      this.session = session;
      this.user = userId;
      this.error = null;

      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem('kindred_session', JSON.stringify(session));
        localStorage.setItem('kindred_user', userId);
      }
    },

    clearSession() {
      this.session = null;
      this.user = null;
      this.error = null;

      if (import.meta.client) {
        localStorage.removeItem('kindred_session');
        localStorage.removeItem('kindred_user');
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();

        const response = await client.auth.login({ email, password });

        if (response.body?.session) {
          this.setSession(response.body.session, response.body.session.userId);
          return { success: true };
        }

        this.error = 'Login failed';
        return { success: false, error: this.error };
      } catch (e: any) {
        const message = e?.message || 'Login failed';
        this.error = message;
        return { success: false, error: message };
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      this.loading = true;
      this.error = null;

      try {
        const supabase = useSupabaseClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        return { success: true };
      } catch (e: any) {
        this.error = e?.message || 'Google login failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async register(email: string, password: string, displayName?: string) {
      this.loading = true;
      this.error = null;

      try {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();

        const response = await client.auth.register({ email, password, displayName });

        if (response.body?.session) {
          this.setSession(response.body.session, response.body.session.userId);
          return { success: true };
        }

        this.error = 'Registration failed';
        return { success: false, error: this.error };
      } catch (e: any) {
        const message = e?.message || 'Registration failed';
        this.error = message;
        return { success: false, error: message };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();

        await client.auth.logout({});
        this.clearSession();
        return { success: true };
      } catch (e: any) {
        // Still clear session even if API call fails
        this.clearSession();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async refreshSession() {
      if (!this.session?.refreshToken) {
        this.clearSession();
        return { success: false, error: 'No refresh token' };
      }

      try {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();

        const response = await client.auth.refresh({
          refreshToken: this.session.refreshToken,
        });

        if (response.body?.session) {
          this.setSession(response.body.session, response.body.session.userId);
          return { success: true };
        }

        this.clearSession();
        return { success: false, error: 'Refresh failed' };
      } catch (e: any) {
        this.clearSession();
        return { success: false, error: e?.message || 'Refresh failed' };
      }
    },

    async ensureProfile() {
      try {
        const { useApi } = await import('~/composables/useApi');
        const { client } = useApi();
        const response = await client.profile.getMe();

        if (response.status === 200 && response.body) {
          return { success: true as const, profile: response.body };
        }

        if (response.status === 404) {
          const supabase = useSupabaseClient();
          const { data: authData } = await supabase.auth.getUser();
          const metadata = authData.user?.user_metadata as Record<string, unknown> | undefined;
          const displayName =
            (typeof metadata?.display_name === 'string' && metadata.display_name) ||
            (typeof metadata?.full_name === 'string' && metadata.full_name) ||
            (typeof metadata?.name === 'string' && metadata.name) ||
            authData.user?.email?.split('@')[0] ||
            null;

          const { error } = await supabase.from('profiles').insert({
            user_id: this.user!,
            display_name: displayName,
          });

          if (error && error.code !== '23505') {
            return { success: false as const, error: error.message };
          }

          const retry = await client.profile.getMe();
          if (retry.status === 200 && retry.body) {
            return { success: true as const, profile: retry.body };
          }
        }

        const message =
          response.status === 404
            ? 'Profile not found'
            : 'message' in (response.body ?? {})
              ? String((response.body as { message: string }).message)
              : 'Could not load profile';

        return { success: false as const, error: message };
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Could not load profile';
        return { success: false as const, error: message };
      }
    },

    async initialize() {
      if (!import.meta.client) return;

      try {
        const savedSession = localStorage.getItem('kindred_session');
        const savedUser = localStorage.getItem('kindred_user');

        if (savedSession && savedUser) {
          const session = SessionSchema.parse(JSON.parse(savedSession));
          this.session = session;
          this.user = savedUser;

          if (session.expiresAt && Date.now() > session.expiresAt * 1000) {
            const result = await this.refreshSession();
            if (!result.success) {
              this.clearSession();
            }
          }
        }
      } catch (e) {
        console.error('Failed to initialize auth state:', e);
        this.clearSession();
      }
    },
  },
});
