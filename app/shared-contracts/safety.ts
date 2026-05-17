import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const safetyContract = c.router({
  block: mapToTsRest('safety.block'),
  listBlocks: mapToTsRest('safety.listBlocks'),
  report: mapToTsRest('safety.report'),
  getPreferences: mapToTsRest('safety.getPreferences'),
  updatePreferences: mapToTsRest('safety.updatePreferences'),
  registerDevice: mapToTsRest('safety.registerDevice'),
});
