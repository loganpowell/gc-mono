import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, unique, uniqueIndex, notNull, primaryKey, index } from 'drizzle-orm/sqlite-core';

const autoIncrementID = {
  id: integer('id', {mode: 'number'}).primaryKey({autoIncrement: true})
};

const timeStamps = {
  createdAt: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`)
}

export const videos = sqliteTable('videos', {
  ...autoIncrementID,
  uploaderID: integer('uploader_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  keywords: text('keywords'),
  filename: text('filename').notNull(),
  filetype: text('filetype').notNull(),
  filesize: text('filesize').notNull(),
  md5Hash: text('md5_hash').notNull().unique(),
  contentText: text('content_text'),
  metadata: text('metadata'),
  status: text('status').notNull().default('pending'),
  ...timeStamps
}, t => ({
}));

export const views = sqliteTable('views', {
  ...autoIncrementID,
  viewableID: integer('viewable_id').notNull(),
  viewerIP: text('viewer_ip').notNull(),
  geolocationData: text('geolocation_data'),
  ...timeStamps
});

export const searches = sqliteTable('searches', {
  ...autoIncrementID,
  searchText: text('search_text').notNull(),
  resultCount: integer('result_count').notNull(),
  searcherIP: text('searcher_ip').notNull(),
  ...timeStamps
});

export const ipAddresses = sqliteTable('ip_addresses', {
  ...autoIncrementID,
  ip: text('ip').notNull(),
  geolocation: text('geolocation').notNull(),
  ...timeStamps
});

export const users = sqliteTable('users', {
  ...autoIncrementID,
  username: text('username').notNull().unique(),
  uid: text('uid').notNull().unique(),
  userType: text('user_type').notNull(),
  ...timeStamps
});

export const authProviders = sqliteTable('auth_providers', {
  ...autoIncrementID,
  name: text('name').unique().notNull(),
  ...timeStamps
});

export const userIdentities = sqliteTable('user_identities', {
  userID: integer('user_id').references(() => users.id).notNull(),
  authProviderID: integer('auth_provider_id').references(() => authProviders.id).notNull(),
  providerUserID: text('provider_user_id').notNull(),
  profile: text('profile').notNull(),
  ...timeStamps
}, t => {
  return {
    pk: primaryKey({columns: [t.providerUserID, t.authProviderID]}),
  };
});
