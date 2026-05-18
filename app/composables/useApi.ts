import { initClient, tsRestFetchApi } from '@ts-rest/core';
import { appContract } from '~/shared-contracts';

let refreshPromise: Promise<boolean> | null = null;

function isAuthPath(path: string) {
  return path.includes('/auth/');
}

async function refreshSessionOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  const authStore = useAuthStore();
  refreshPromise = authStore
    .refreshSession()
    .then((result) => result.success)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const client = initClient(appContract, {
    baseUrl: config.public.apiBaseUrl,
    baseHeaders: {
      'Content-Type': 'application/json',
    },
    api: async (args) => {
      const headers: Record<string, string> = {
        ...(args.headers as Record<string, string>),
      };

      const token = authStore.accessToken;
      if (token && !isAuthPath(args.path)) {
        headers.Authorization = `Bearer ${token}`;
      }

      let response = await tsRestFetchApi({ ...args, headers });

      if (
        response.status === 401 &&
        token &&
        !isAuthPath(args.path)
      ) {
        const refreshed = await refreshSessionOnce();
        if (refreshed && authStore.accessToken) {
          headers.Authorization = `Bearer ${authStore.accessToken}`;
          response = await tsRestFetchApi({ ...args, headers });
        }
      }

      return response;
    },
  });

  return { client };
};
