import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const profileFieldsContract = c.router({
  getMyFields: mapToTsRest('profileFields.getMyFields'),
  getFieldByKey: mapToTsRest('profileFields.getFieldByKey'),
  upsertField: mapToTsRest('profileFields.upsertField'),
  deleteField: mapToTsRest('profileFields.deleteField'),
  listPublicFields: mapToTsRest('profileFields.listPublicFields'),
});
