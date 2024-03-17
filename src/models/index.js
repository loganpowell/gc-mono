import { and, eq, inArray, like } from "drizzle-orm";

import {
  users,
  authProviders,
  userIdentities,
  translations,
  videos,
} from "../../db/schema";

export const User = (db) => ({
  withUID: async (uid) => {
    const result = (
      await db
        .select()
        .from(users)
        .innerJoin(userIdentities, eq(users.id, userIdentities.userID))
        .where(eq(users.uid, uid))
        .limit(1)
    )[0];

    if (result?.users && result.user_identities)
      return { ...result.users, ...result.user_identities };

    return null;
  },
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
    language,
  }) => {
    const video = (
      await db
        .insert(videos)
        .values({
          uploaderID,
          filename,
          filetype,
          filesize,
          md5Hash,
          metadata: JSON.stringify(metadata),
          language,
        })
        .onConflictDoNothing()
        .returning()
    )[0];

    ["title", "description", "keywords"].forEach(async (attribute) => {
      const translation = await db
        .insert(translations)
        .values({
          translatableID: video.id,
          translatableType: "video",
          translatableField: attribute,
          text: metadata[attribute],
          language,
        })
        .returning();
    });

    return video;
  },
  delete: async (id) => {
    return await db.delete(videos).where(eq(videos.id, id)).returning();
  },
  getUnReviewed: async () =>
    await db.select().from(videos).where(eq(videos.status, "pending")),
  setStatus: async ({ videoID, status }) =>
    await db.update(videos).set({ status }).where(eq(videos.id, videoID)),
  getByMD5Hash: async (md5) =>
    await db.select().from(videos).where(eq(videos.md5Hash, md5)),
  getByUploader: async (uploaderID) =>
    await db.select().from(videos).where(eq(videos.uploaderID, uploaderID)),
  search: async ({ keywords, language }) => {
    const results = await db
      .select()
      .from(videos)
      .innerJoin(
        translations,
        and(
          eq(videos.id, translations.translatableID),
          eq(translations.translatableType, "video"),
          eq(translations.language, language),
        ),
      )
      .where(
        and(
          inArray(translations.translatableField, [
            "title",
            "description",
            "keywords",
            "content_text",
          ]),
          like(translations.text, `%${keywords}%`),
        ),
      )
      .groupBy(videos.id);

    return results.reduce((r, result) => {
      r.push({ ...result.videos, ...JSON.parse(result.videos.metadata) });

      return r;
    }, []);
  },
});
