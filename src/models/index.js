import { eq, and } from 'drizzle-orm';

import { users } from '../../db/schema';

export const User = db => ({
  withUID: async uid => await db
    .select()
    .from(users)
    .where(eq(users.uid, uid))
    .limit(1)[0],
  withUsername: async username => (await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
  )[0],
  create: async ({
    username, uid, userType
  }) => (await db
    .insert(users)
    .values({username, uid, userType})
    .onConflictDoNothing()
    .returning()
  )[0]
});
