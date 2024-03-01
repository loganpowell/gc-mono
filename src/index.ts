import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { parse } from 'cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import * as jose from 'jose';

import * as schema from '../db/schema';
import { User, UserIdentity, AuthProvider } from './models';

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:8788', 'https://medic.gaza-care.com'],
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
  let authProvider = await AuthProvider(c.var.db).create({name: 'google'});
  authProvider ||= await AuthProvider(c.var.db).withName({name: 'google'});
  let user = await currentUser(c);

  if (!user) {
    const { creds, userType } = await c.req.raw.json();
    const credentials = jose.decodeJwt(creds);
    const uid = crypto.randomUUID();
    const username = `goog-${credentials.sub}`;
    user = await User(c.var.db).create({username, uid, userType});
    if (user) {
      const identity = await UserIdentity(c.var.db).create({userID: user.id, authProviderID: authProvider.id, providerUserID: credentials.sub, profile: JSON.stringify(credentials)});
    }
    if (!user) {
      user = await User(c.var.db).withUsername(username);
    }
  }

  return new Response(
    JSON.stringify(user),
    {
      headers: {'Set-Cookie': `gcre_session=${user.uid};Path=/;SameSite=Strict;Secure;HttpOnly`}
    }
  );
});

app.get('/v1/session', async c => {
  const user = await currentUser(c);

  if (user) {
    return new Response(JSON.stringify(user), {status: 200});
  }

  return new Response('unauthorized', {status: 401});
});

app.get('/v1/logout', async c => {
  return new Response(null, {
    status: 204,
    headers: {
      'Clear-Site-Data': "\"cookies\""
    }
  });
});

const currentUID = async context => {
  return parse(context.req.raw.headers.get('cookie') || '')['gcre_session'];
}

const currentUser = async context => {
  const uid = await currentUID(context);

  if (uid) {
    const user = await User(context.var.db).withUID(uid);

    if (!user) return null;

    return user;
  }

  return null;
};

export default app;
