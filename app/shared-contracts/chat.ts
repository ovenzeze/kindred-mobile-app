import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const chatContract = c.router({
  listConversations: mapToTsRest('chat.listConversations'),
  listMessages: mapToTsRest('chat.listMessages'),
  sendMessage: mapToTsRest('chat.sendMessage'),
  markRead: mapToTsRest('chat.markRead'),
});
