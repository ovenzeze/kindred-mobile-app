import { initClient } from '@ts-rest/core';
import { appContract } from '~/shared-contracts';

export const useApi = () => {
  const config = useRuntimeConfig();
  
  const client = initClient(appContract, {
    baseUrl: config.public.apiBaseUrl,
    baseHeaders: {
      'Content-Type': 'application/json',
    },
  });

  return { client };
};
