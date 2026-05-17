import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const matchesContract = c.router({
  list: mapToTsRest('matches.list'),
  get: mapToTsRest('matches.get'),
  unmatch: mapToTsRest('matches.unmatch'),
});
