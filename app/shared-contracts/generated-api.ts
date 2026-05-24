import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const profileFields_upsertField_Body = z
  .object({
    fieldKey: z.string(),
    value: z.record(z.unknown().nullable()),
    visibility: z.enum(["public", "private"]).optional(),
    sortOrder: z.number().optional(),
  })
  .passthrough();
const albums_createAlbum_Body = z
  .object({
    title: z.string().min(1),
    visibility: z.enum(["public", "private", "granted_users"]).optional(),
  })
  .passthrough();
const albums_updateAlbum_Body = z
  .object({
    title: z.string().min(1),
    visibility: z.enum(["public", "private", "granted_users"]),
    sortOrder: z.number(),
  })
  .partial()
  .passthrough();
const albums_confirmUpload_Body = z
  .object({
    objectKey: z.string(),
    url: z.string().url(),
    metadata: z.record(z.unknown().nullable()).optional(),
  })
  .passthrough();
const albums_getUploadUrl_Body = z
  .object({
    objectKey: z.string().optional(),
    contentType: z.string().min(1),
    expiresIn: z.number().optional(),
  })
  .passthrough();
const albums_reorderPhotos_Body = z
  .object({
    photoOrders: z.array(
      z
        .object({ photoId: z.string().uuid(), sortOrder: z.number() })
        .passthrough()
    ),
  })
  .passthrough();
const albums_grantAccess_Body = z
  .object({ viewerId: z.string().uuid(), isAllowed: z.boolean().optional() })
  .passthrough();

export const schemas = {
  profileFields_upsertField_Body,
  albums_createAlbum_Body,
  albums_updateAlbum_Body,
  albums_confirmUpload_Body,
  albums_getUploadUrl_Body,
  albums_reorderPhotos_Body,
  albums_grantAccess_Body,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/albums",
    alias: "albums.listAlbums",
    requestFormat: "json",
    response: z
      .object({
        albums: z.array(
          z
            .object({
              id: z.string().uuid(),
              ownerId: z.string().uuid(),
              title: z.string(),
              visibility: z.enum(["public", "private", "granted_users"]),
              sortOrder: z.number(),
              isDefault: z.boolean(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/albums",
    alias: "albums.createAlbum",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_createAlbum_Body,
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        ownerId: z.string().uuid(),
        title: z.string(),
        visibility: z.enum(["public", "private", "granted_users"]),
        sortOrder: z.number(),
        isDefault: z.boolean(),
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
    ],
  },
  {
    method: "patch",
    path: "/albums/:id",
    alias: "albums.updateAlbum",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_updateAlbum_Body,
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
        ownerId: z.string().uuid(),
        title: z.string(),
        visibility: z.enum(["public", "private", "granted_users"]),
        sortOrder: z.number(),
        isDefault: z.boolean(),
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
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/albums/:id",
    alias: "albums.deleteAlbum",
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
        status: 400,
        description: `400`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/albums/:id/grants",
    alias: "albums.grantAccess",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_grantAccess_Body,
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
        albumId: z.string().uuid(),
        viewerId: z.string().uuid(),
        isAllowed: z.boolean(),
        revokedAt: z.string().nullable(),
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
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/albums/:id/grants",
    alias: "albums.listGrants",
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
        grants: z.array(
          z
            .object({
              id: z.string().uuid(),
              albumId: z.string().uuid(),
              viewerId: z.string().uuid(),
              isAllowed: z.boolean(),
              revokedAt: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
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
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/albums/:id/grants/:viewerId",
    alias: "albums.revokeAccess",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "viewerId",
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
    path: "/albums/:id/photos",
    alias: "albums.listPhotos",
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
        photos: z.array(
          z
            .object({
              id: z.string().uuid(),
              albumId: z.string().uuid(),
              ownerId: z.string().uuid(),
              objectKey: z.string(),
              url: z.string().url(),
              sortOrder: z.number(),
              metadata: z.record(z.unknown().nullable()),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 403,
        description: `403`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/albums/:id/photos",
    alias: "albums.confirmUpload",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_confirmUpload_Body,
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
        albumId: z.string().uuid(),
        ownerId: z.string().uuid(),
        objectKey: z.string(),
        url: z.string().url(),
        sortOrder: z.number(),
        metadata: z.record(z.unknown().nullable()),
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
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 409,
        description: `409`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/albums/:id/photos/:photoId",
    alias: "albums.deletePhoto",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "photoId",
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
    method: "patch",
    path: "/albums/:id/photos/reorder",
    alias: "albums.reorderPhotos",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_reorderPhotos_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ ok: z.literal(true) }).passthrough(),
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
    path: "/albums/:id/upload-url",
    alias: "albums.getUploadUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: albums_getUploadUrl_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        uploadUrl: z.string().url(),
        objectKey: z.string(),
        expiresAt: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `404`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
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
    response: z.unknown().nullable(),
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
        schema: z
          .object({ email: z.string().email(), password: z.string() })
          .passthrough(),
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
    response: z.unknown().nullable(),
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
        schema: z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
            displayName: z.string().min(1).max(64).optional(),
          })
          .passthrough(),
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
        schema: z
          .object({ platform: z.string().min(1), pushToken: z.string().min(1) })
          .passthrough(),
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
    response: z.unknown().nullable(),
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
        schema: z
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
          .passthrough(),
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
    method: "get",
    path: "/me/fields",
    alias: "profileFields.getMyFields",
    requestFormat: "json",
    response: z
      .object({
        fields: z.array(
          z
            .object({
              id: z.string().uuid(),
              userId: z.string().uuid(),
              fieldKey: z.string(),
              value: z.record(z.unknown().nullable()),
              visibility: z.enum(["public", "private"]),
              sortOrder: z.number(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "put",
    path: "/me/fields",
    alias: "profileFields.upsertField",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: profileFields_upsertField_Body,
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        fieldKey: z.string(),
        value: z.record(z.unknown().nullable()),
        visibility: z.enum(["public", "private"]),
        sortOrder: z.number(),
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
    ],
  },
  {
    method: "get",
    path: "/me/fields/:key",
    alias: "profileFields.getFieldByKey",
    requestFormat: "json",
    parameters: [
      {
        name: "key",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        fieldKey: z.string(),
        value: z.record(z.unknown().nullable()),
        visibility: z.enum(["public", "private"]),
        sortOrder: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
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
    path: "/me/fields/:key",
    alias: "profileFields.deleteField",
    requestFormat: "json",
    parameters: [
      {
        name: "key",
        type: "Path",
        schema: z.string(),
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
    method: "patch",
    path: "/me/location",
    alias: "profile.updateLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Body`,
        type: "Body",
        schema: z
          .object({
            latitude: z.number().gte(-90).lte(90),
            longitude: z.number().gte(-180).lte(180),
          })
          .passthrough(),
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
        schema: z
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
          .passthrough(),
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
        schema: z
          .object({
            targetUserId: z.string().uuid(),
            action: z.enum(["like", "pass", "super_like"]),
          })
          .passthrough(),
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
  {
    method: "get",
    path: "/users/:id/albums",
    alias: "albums.listUserAlbums",
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
        albums: z.array(
          z
            .object({
              id: z.string().uuid(),
              ownerId: z.string().uuid(),
              title: z.string(),
              visibility: z.enum(["public", "private", "granted_users"]),
              sortOrder: z.number(),
              isDefault: z.boolean(),
              createdAt: z.string(),
              updatedAt: z.string(),
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
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id/albums/public",
    alias: "albums.listPublicAlbums",
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
        albums: z.array(
          z
            .object({
              id: z.string().uuid(),
              ownerId: z.string().uuid(),
              title: z.string(),
              visibility: z.enum(["public", "private", "granted_users"]),
              sortOrder: z.number(),
              isDefault: z.boolean(),
              createdAt: z.string(),
              updatedAt: z.string(),
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
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id/fields",
    alias: "profileFields.listPublicFields",
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
        fields: z.array(
          z
            .object({
              fieldKey: z.string(),
              value: z.record(z.unknown().nullable()),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 500,
        description: `500`,
        schema: z.object({ message: z.string() }).passthrough(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
