import { eq, and } from "drizzle-orm";

import { users, authProviders, userIdentities, videos } from "../../db/schema";

export const User = (db) => ({
  withUID: async (uid) =>
    (await db.select().from(users).where(eq(users.uid, uid)).limit(1))[0],
  withUsername: async (username) =>
    (
      await db.select().from(users).where(eq(users.username, username)).limit(1)
    )[0],
  create: async ({ username, uid, userType }) =>
    (
      await db
        .insert(users)
        .values({ username, uid, userType })
        .onConflictDoNothing()
        .returning()
    )[0],
});

export const AuthProvider = (db) => ({
  create: async ({ name }) =>
    (
      await db
        .insert(authProviders)
        .values({ name })
        .onConflictDoNothing()
        .returning()
    )[0],
  withName: async ({ name }) =>
    (
      await db
        .select()
        .from(authProviders)
        .where(eq(authProviders.name, name))
        .limit(1)
    )[0],
});

export const UserIdentity = (db) => ({
  create: async ({ userID, authProviderID, providerUserID, profile }) =>
    (
      await db
        .insert(userIdentities)
        .values({ userID, authProviderID, providerUserID, profile })
        .onConflictDoNothing()
        .returning()
    )[0],
});

export const Video = (db) => ({
  create: async ({
    uploaderID,
    title,
    description,
    keywords,
    filename,
    filetype,
    filesize,
    md5Hash,
    metadata,
  }) =>
    (
      await db
        .insert(videos)
        .values({
          uploaderID,
          title,
          description,
          keywords,
          filename,
          filetype,
          filesize,
          md5Hash,
          metadata,
        })
        .onConflictDoNothing()
        .returning()
    )[0],
  getByMD5Hash: async (md5) =>
    await db.select().from(videos).where(eq(videos.md5Hash, md5)),
});
