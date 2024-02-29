import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { parse } from 'cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import * as jose from 'jose';

import * as schema from '../db/schema';
import { User } from './models';

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.options('*', (c) => {
  return new Response(null, {status: 204});
})

app.use('*', async (context, next) => {
  const db = drizzle(context.env.DB, { schema });
  context.set('db', db);
  await next();
});

app.post('/v1/auth/google/success', async c => {
  let user = currentUser(c);

  if (!user) {
    const { creds, userType } = await context.req.raw.json();
    const credentials = jose.decodeJwt(creds);
    const uid = crypto.randomUUID();
    user = await User(c.var.db).create({username: `goog-${credentials.sub, uid, userType}`});
  }

  return new Response(
    JSON.stringify(user),
    {
      headers: {'Set-Cookie': `gcre_session=${user.uid};Path=/;SameSite=Strict;Secure;HttpOnly`}
    }
  );
});

app.get('/v1/session', async c => {
  const uid = await currentUID(c);

  if (uid) {
    const user = await User(c.var.db).withUID(uid);

    return new Response(user, {status: 200});
  }

  return new Response('unauthorized', {status: 401});
});

const currentUID = async context => {
  return parse(context.req.raw.headers.get('cookie') || '')['gcre_session'];
}

const currentUser = async context => {
  const uid = currentUID(context);

  if (uid) {
    const user = await User(db).withUID(uid);

    if (!user) return null;

    return user;
  }

  return null;
};

export default app;
