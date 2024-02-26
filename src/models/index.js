import { eq, and } from 'drizzle-orm';

import { users } from '../schema';

export const User = db => ({
  withUID: async uid => await db
    .select()
    .from(users)
    .where(eq(users.uid, uid))
    .limit(1)[0],
  
});
