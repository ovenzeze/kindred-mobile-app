import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const healthContract = c.router({
  check: mapToTsRest('health.check'),
});
