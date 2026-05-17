import { initContract } from '@ts-rest/core';
import { authContract } from './auth';
import { profileContract } from './profile';
import { discoveryContract } from './discovery';
import { matchesContract } from './matches';
import { chatContract } from './chat';
import { safetyContract } from './safety';
import { healthContract } from './health';

const c = initContract();

export const appContract = c.router({
  health: healthContract,
  auth: authContract,
  profile: profileContract,
  discovery: discoveryContract,
  matches: matchesContract,
  chat: chatContract,
  safety: safetyContract,
});

export type AppContract = typeof appContract;
