import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const authContract = c.router({
  register: mapToTsRest('auth.register'),
  login: mapToTsRest('auth.login'),
  logout: mapToTsRest('auth.logout'),
  refresh: mapToTsRest('auth.refresh'),
  deleteAccount: mapToTsRest('auth.deleteAccount'),
});
