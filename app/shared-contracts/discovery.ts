import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const discoveryContract = c.router({
  getQueue: mapToTsRest('discovery.getQueue'),
  swipe: mapToTsRest('discovery.swipe'),
  getSwipesSent: mapToTsRest('discovery.getSwipesSent'),
});
