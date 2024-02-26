import { Hono } from 'hono'
import { parse } from 'cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';

import { User } from './models'

const app = new Hono()

const currentUser = async context => {
  const uid = parse(context.request.headers.get('cookie') || '')['gcre_session'];

  if (uid) {
    const user = await User.withUID(uid);

    if (!user) return null;

    return user;
  }

  return null;
};

app.use('*', async (context, next) => {
  const db = drizzle(context.env.DB, { schema });
  context.set('db', db);
  await next();
});

app.get('/v1/auth/google/success', c => {
  return c.text('Hello Hono!')
  const uid = currentUser?.uid || crypto.randomUUID();
  
});

export default app;
