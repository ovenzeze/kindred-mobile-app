import { z } from 'zod';
import { endpoints } from './generated-api';

/**
 * Helper to find an endpoint by its alias
 */
const getEndpoint = (alias: string) => {
  const endpoint = endpoints.find((e: any) => e.alias === alias);
  if (!endpoint) {
    throw new Error(`Endpoint with alias "${alias}" not found in generated API.`);
  }
  return endpoint as any;
};

// --- Profile Schemas ---

// Profile is the response of getMe
export const ProfileSchema = getEndpoint('profile.getMe').response;

// ProfileCard is the items in the discovery queue
const discoveryQueueResponse = getEndpoint('discovery.getQueue').response;
export const ProfileCardSchema = discoveryQueueResponse.shape.users.element;

// --- Auth Schemas ---

// Session is part of the login response
const loginResponse = getEndpoint('auth.login').response;
export const SessionSchema = loginResponse.shape.session;

// --- Match Schemas ---

// Match is the items in the matches list
const matchesListResponse = getEndpoint('matches.list').response;
export const MatchSchema = matchesListResponse.shape.matches.element;

// --- Chat Schemas ---

// Conversation is the items in the conversation list
const conversationsListResponse = getEndpoint('chat.listConversations').response;
export const ConversationSchema = conversationsListResponse.shape.conversations.element;

// Message is the items in the messages list
const messagesListResponse = getEndpoint('chat.listMessages').response;
export const MessageSchema = messagesListResponse.shape.messages.element;

// --- Album Schemas ---
export const AlbumSchema = getEndpoint('albums.listAlbums').response.element;
export const AlbumPhotoSchema = getEndpoint('albums.listPhotos').response.element;

// --- Profile Field Schemas ---
export const ProfileFieldSchema = getEndpoint('profileFields.getMyFields').response.element;
