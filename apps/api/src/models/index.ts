import { and, eq, inArray, like } from 'drizzle-orm';

import type { DrizzleD1Database } from 'drizzle-orm/d1';
import {
  users,
  authProviders,
  userIdentities,
  translations,
  videos,
} from '../../db/schema';

interface CreateUser {
  username: string;
  uid: string;
  userType: string;
}

export const User = (db) => ({
  withUID: async (uid: string) => {
    const result = (
      await db
        .select()
        .from(users)
        .innerJoin(userIdentities, eq(users.id, userIdentities.userID))
        .where(eq(users.uid, uid))
        .limit(1)
    )[0];

    if (result?.users !== undefined && result.user_identities !== undefined)
      return { ...result.users, ...result.user_identities };

    return null;
  },

  withUsername: async (username: string) =>
    (
      await db.select().from(users).where(eq(users.username, username)).limit(1)
    )[0],
  create: async ({ username, uid, userType }: CreateUser) =>
    (
      await db
        .insert(users)
        .values({ username, uid, userType })
        .onConflictDoNothing()
        .returning()
    )[0],
});

export const AuthProvider = (db: DrizzleD1Database) => ({
  create: async ({ name }: { name: string }) =>
    (
      await db
        .insert(authProviders)
        .values({ name })
        .onConflictDoNothing()
        .returning()
    )[0],
  withName: async ({ name }: { name: string }) =>
    (
      await db
        .select()
        .from(authProviders)
        .where(eq(authProviders.name, name))
        .limit(1)
    )[0],
});

interface CreateUserIdentity {
  userID: number;
  authProviderID: number;
  providerUserID: string;
  profile: string;
}

export const UserIdentity = (db: DrizzleD1Database) => ({
  create: async ({
    userID,
    authProviderID,
    providerUserID,
    profile,
  }: CreateUserIdentity) =>
    (
      await db
        .insert(userIdentities)
        .values({ userID, authProviderID, providerUserID, profile })
        .onConflictDoNothing()
        .returning()
    )[0],
});

interface CreateVideo {
  uploaderID: number;
  title: string;
  description: string;
  keywords: string;
  filename: string;
  filetype: string;
  filesize: number;
  md5Hash: string;
  metadata: {
    title: string;
    description: string;
    keywords: string;
    content_text: string;
  };
  language: string;
}

enum MetadataFields {
  title = 'title',
  description = 'description',
  keywords = 'keywords',
  content_text = 'content_text',
}

enum Status {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
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
  }: CreateVideo) => {
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

    for (const field of ['title', 'description', 'keywords'] as Array<
      keyof typeof MetadataFields
    >) {
      await db
        .insert(translations)
        .values({
          translatableID: (await video).id,
          translatableType: 'video',
          translatableField: field,
          text: metadata[field],
          language,
        })
        .returning();
    }

    return video;
  },
  delete: async (id: number) => {
    await db
      .delete(translations)
      .where(
        and(
          eq(translations.translatableID, id),
          eq(translations.translatableType, 'video'),
        ),
      );
    await db.delete(videos).where(eq(videos.id, id)).returning();
  },
  getUnReviewed: async () => {
    await db.select().from(videos).where(eq(videos.status, 'pending'));
  },
  setStatus: async ({
    videoID,
    status,
  }: {
    videoID: number;
    status: keyof typeof Status;
  }) => {
    await db.update(videos).set({ status }).where(eq(videos.id, videoID));
  },
  getByMD5Hash: async (md5: string) => {
    await db.select().from(videos).where(eq(videos.md5Hash, md5));
  },
  getByUploader: async (uploaderID: number) => {
    await db.select().from(videos).where(eq(videos.uploaderID, uploaderID));
  },
  search: async ({
    keywords,
    language,
  }: {
    keywords: string;
    language: string;
  }) => {
    const results = await db
      .select()
      .from(videos)
      .innerJoin(
        translations,
        and(
          eq(videos.id, translations.translatableID),
          eq(translations.translatableType, 'video'),
          eq(translations.language, language),
        ),
      )
      .where(
        and(
          inArray(translations.translatableField, [
            'title',
            'description',
            'keywords',
            'content_text',
          ]),
          like(translations.text, `%${keywords}%`),
        ),
      )
      .groupBy(videos.id);
    console.log({ results });
    return results.reduce((r, result) => {
      r.push({ ...result.videos, ...JSON.parse(result.videos.metadata) });

      return r;
    }, []);
  },
});
