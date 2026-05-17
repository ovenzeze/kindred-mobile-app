import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const profileContract = c.router({
  getMe: mapToTsRest('profile.getMe'),
  updateMe: mapToTsRest('profile.updateMe'),
  updateLocation: mapToTsRest('profile.updateLocation'),
  getUser: mapToTsRest('profile.getUser'),
});
