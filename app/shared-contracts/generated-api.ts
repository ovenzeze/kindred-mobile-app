import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const auth_register_Body = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(1).max(64).optional(),
  })
  .passthrough();
const auth_login_Body = z
  .object({ email: z.string().email(), password: z.string() })
  .passthrough();
const profile_updateMe_Body = z
  .object({
    displayName: z.string().min(1).max(64),
    bio: z.string().max(500),
    birthdate: z.string(),
    gender: z.string().max(32),
    orientation: z.string().max(32),
    photos: z.array(z.string().url()),
    preferences: z.record(z.unknown().nullable()),
  })
  .partial()
  .passthrough();
const profile_updateLocation_Body = z
  .object({
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
  })
  .passthrough();
const discovery_swipe_Body = z
  .object({
    targetUserId: z.string().uuid(),
    action: z.enum(["like", "pass", "super_like"]),
  })
  .passthrough();
const safety_report_Body = z
  .object({
    userId: z.string().uuid(),
    reason: z.enum([
      "spam",
      "harassment",
      "inappropriate_content",
      "fake_profile",
      "other",
    ]),
    details: z.string().max(1000).optional(),
  })
  .passthrough();
const safety_registerDevice_Body = z
  .object({ platform: z.string().min(1), pushToken: z.string().min(1) })
  .passthrough();

export const schemas = {
  auth_register_Body,
  auth_login_Body,
  profile_updateMe_Body,
  profile_updateLocation_Body,
  discovery_swipe_Body,
  safety_report_Body,
  safety_registerDevice_Body,
};

export const endpoints = makeApi([
  {
    method: "delete",
    path: "/auth/account",
    alias: "auth.deleteAccount",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/login",
    alias: "auth.login",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: auth_login_Body,
      },
    ],
    response: z
      .object({
        session: z
          .object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expiresAt: z.number(),
            userId: z.string().uuid(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/logout",
    alias: "auth.logout",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.unknown(),
  },
  {
    method: "post",
    path: "/auth/refresh",
    alias: "auth.refresh",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({ refreshToken: z.string() }).passthrough(),
      },
    ],
    response: z
      .object({
        session: z
          .object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expiresAt: z.number(),
            userId: z.string().uuid(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/register",
    alias: "auth.register",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: auth_register_Body,
      },
    ],
    response: z
      .object({
        session: z
          .object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expiresAt: z.number(),
            userId: z.string().uuid(),
          })
          .passthrough(),
        profile: z
          .object({
            userId: z.string().uuid(),
            displayName: z.string().nullable(),
            bio: z.string().nullable(),
            birthdate: z.string().nullable(),
            gender: z.string().nullable(),
            orientation: z.string().nullable(),
            photos: z.array(z.string()),
            preferences: z.record(z.unknown().nullable()),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `400`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/blocks",
    alias: "safety.block",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({ userId: z.string().uuid() }).passthrough(),
      },
    ],
    response: z.object({ id: z.string().uuid() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/blocks",
    alias: "safety.listBlocks",
    requestFormat: "json",
    response: z.object({ userIds: z.array(z.string().uuid()) }).passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/conversations",
    alias: "chat.listConversations",
    requestFormat: "json",
    response: z
      .object({
        conversations: z.array(
          z
            .object({
              id: z.string().uuid(),
              matchId: z.string().uuid(),
              lastMessage: z
                .object({
                  id: z.string().uuid(),
                  body: z.string(),
                  senderId: z.string().uuid(),
                  createdAt: z.string(),
                })
                .passthrough()
                .nullable(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/conversations/:id/messages",
    alias: "chat.listMessages",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(100).nullish().default(50),
      },
      {
        name: "before",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
    ],
    response: z
      .object({
        messages: z.array(
          z
            .object({
              id: z.string().uuid(),
              conversationId: z.string().uuid(),
              senderId: z.string().uuid(),
              body: z.string(),
              readAt: z.string().nullable(),
              createdAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/conversations/:id/messages",
    alias: "chat.sendMessage",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({ body: z.string().min(1).max(4000) }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        conversationId: z.string().uuid(),
        senderId: z.string().uuid(),
        body: z.string(),
        readAt: z.string().nullable(),
        createdAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/devices",
    alias: "safety.registerDevice",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: safety_registerDevice_Body,
      },
    ],
    response: z.object({ id: z.string().uuid() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/discovery",
    alias: "discovery.getQueue",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(50).nullish().default(20),
      },
      {
        name: "latitude",
        type: "Query",
        schema: z.number().gte(-90).lte(90).nullish(),
      },
      {
        name: "longitude",
        type: "Query",
        schema: z.number().gte(-180).lte(180).nullish(),
      },
      {
        name: "maxDistanceKm",
        type: "Query",
        schema: z.number().gte(0).optional().default(50),
      },
    ],
    response: z
      .object({
        users: z.array(
          z
            .object({
              userId: z.string().uuid(),
              displayName: z.string().nullable(),
              bio: z.string().nullable(),
              birthdate: z.string().nullable(),
              gender: z.string().nullable(),
              photos: z.array(z.string()),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/health",
    alias: "health.check",
    requestFormat: "json",
    response: z
      .object({ status: z.literal("ok"), timestamp: z.string() })
      .passthrough(),
  },
  {
    method: "get",
    path: "/matches",
    alias: "matches.list",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(50).nullish().default(20),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().gte(0).nullish().default(0),
      },
    ],
    response: z
      .object({
        matches: z.array(
          z
            .object({
              id: z.string().uuid(),
              otherUserId: z.string().uuid(),
              matchedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/matches/:id",
    alias: "matches.get",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        otherUserId: z.string().uuid(),
        matchedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/matches/:id",
    alias: "matches.unmatch",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/me",
    alias: "profile.getMe",
    requestFormat: "json",
    response: z
      .object({
        userId: z.string().uuid(),
        displayName: z.string().nullable(),
        bio: z.string().nullable(),
        birthdate: z.string().nullable(),
        gender: z.string().nullable(),
        orientation: z.string().nullable(),
        photos: z.array(z.string()),
        preferences: z.record(z.unknown().nullable()),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/me",
    alias: "profile.updateMe",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: profile_updateMe_Body,
      },
    ],
    response: z
      .object({
        userId: z.string().uuid(),
        displayName: z.string().nullable(),
        bio: z.string().nullable(),
        birthdate: z.string().nullable(),
        gender: z.string().nullable(),
        orientation: z.string().nullable(),
        photos: z.array(z.string()),
        preferences: z.record(z.unknown().nullable()),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `400`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/me/location",
    alias: "profile.updateLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: profile_updateLocation_Body,
      },
    ],
    response: z.object({ ok: z.literal(true) }).passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/messages/:id/read",
    alias: "chat.markRead",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        conversationId: z.string().uuid(),
        senderId: z.string().uuid(),
        body: z.string(),
        readAt: z.string().nullable(),
        createdAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/reports",
    alias: "safety.report",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: safety_report_Body,
      },
    ],
    response: z.object({ id: z.string().uuid() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/settings/preferences",
    alias: "safety.getPreferences",
    requestFormat: "json",
    response: z.record(z.unknown().nullable()),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/settings/preferences",
    alias: "safety.updatePreferences",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z.record(z.unknown().nullable()),
      },
    ],
    response: z.record(z.unknown().nullable()),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/swipes",
    alias: "discovery.swipe",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: discovery_swipe_Body,
      },
    ],
    response: z
      .object({ matched: z.boolean(), matchId: z.string().uuid().optional() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/swipes/sent",
    alias: "discovery.getSwipesSent",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(50).nullish().default(20),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().gte(0).nullish().default(0),
      },
    ],
    response: z
      .object({
        swipes: z.array(
          z
            .object({
              id: z.string().uuid(),
              toUserId: z.string().uuid(),
              action: z.enum(["like", "pass", "super_like"]),
              createdAt: z.string().datetime({ offset: true }),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `401`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "profile.getUser",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        userId: z.string().uuid(),
        displayName: z.string().nullable(),
        bio: z.string().nullable(),
        birthdate: z.string().nullable(),
        gender: z.string().nullable(),
        photos: z.array(z.string()),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
