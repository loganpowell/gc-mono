import { parse } from 'cookie';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { cors } from 'hono/cors';
import * as jose from 'jose';

import * as schema from '../db/schema';
import { User, UserIdentity, AuthProvider, Video } from './models';

declare module 'hono' {
  interface ContextVariableMap {
    db: DrizzleD1Database<Record<string, never>>;
  }
}

type Bindings = {
  ALLOWED_ORIGINS: string;
  DB: D1Database;
  R2: R2Bucket;
};

//const app = new Hono();
const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  const origins = c?.env?.ALLOWED_ORIGINS;
  const corsMiddleware = cors({
    origin: (origin) =>
      origins.split(', ').includes(origin) ||
      origin.endsWith('medic-eev.pages.dev') ||
      origin.endsWith('admin-93h.pages.dev') ||
      origin.endsWith('gaza-care.com')
        ? origin
        : 'https://gaza-care.com',
    allowHeaders: ['Content-Type', 'Authorization', 'x-highlight-request'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });

  return await corsMiddleware(c, next);
});

app.use('*', async (context, next) => {
  const database = context?.env?.DB;
  const db = drizzle(database, { schema });
  context.set('db', db);
  await next();
});

const authenticate = async (c: Context) => {
  return await currentUser(c);
};

app.post('/v1/auth/google/success', async (c) => {
  const { creds, userType }: { creds: string; userType: string } =
    await c.req.raw.json();
  const credentials = jose.decodeJwt(creds);

  let authProvider = await AuthProvider(c.var.db).create({ name: 'google' });
  authProvider ||= await AuthProvider(c.var.db).withName({ name: 'google' });
  let user = await currentUser(c);

  if (user !== undefined) {
    const uid = crypto.randomUUID();
    const username = `goog-${credentials.sub}`;
    user = await User(c.var.db).create({ username, uid, userType });
    if (user !== undefined && credentials?.sub !== undefined) {
      const identity = await UserIdentity(c.var.db).create({
        userID: user.id,
        authProviderID: authProvider.id,
        providerUserID: credentials?.sub,
        profile: JSON.stringify(credentials),
      });
    } else {
      user = await User(c.var.db).withUsername(username);
    }
  }

  return new Response(
    JSON.stringify({ ...user, profile: JSON.stringify({ ...credentials }) }),
    {
      headers: {
        'Set-Cookie': `gcre_session=${user.uid};Path=/;SameSite=Strict;Secure;HttpOnly`,
      },
    },
  );
});

app.get('/v1/session', async (c) => {
  const user = await currentUser(c);

  if (user !== undefined) {
    return new Response(JSON.stringify(user), { status: 200 });
  }

  return new Response('unauthorized', { status: 401 });
});

app.post('/v1/videos', async (c) => {
  const user = await authenticate(c);

  const formData = await c.req.raw.formData();
  const file = formData.get('file');
  const meta = formData.get('metadata');
  if (!file || !meta) {
    return new Response(JSON.stringify({ message: 'bad' }), { status: 400 });
  }
  console.log({ file, meta });
  const metadata = JSON.parse(meta);
  const language = metadata.language.split('-')[0];
  const encoder = new TextEncoder();
  const fileData = encoder.encode(file).buffer;
  //const fileData = await file?.arrayBuffer();
  const digest = await crypto.subtle.digest('MD5', fileData);
  const bytes = Array.from(new Uint8Array(digest));
  const md5 = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');

  await c.env.R2.put(file.name, fileData);

  const video =
    (await Video(c.var.db).create({
      uploaderID: user.id,
      language,
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      filename: file.name,
      filetype: file.type,
      filesize: file.size,
      md5Hash: md5,
      metadata,
    })) || (await Video(c.var.db).getByMD5Hash(md5));

  return new Response(JSON.stringify({ ...video }), { status: 200 });
});

app.get('/v1/videos', async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  console.log({ user });
  const userId = user?.id || 1;
  const matchingVideos = await Video(c.var.db).getByUploader(userId);

  return new Response(JSON.stringify(matchingVideos));
});

app.post('/v1/videos/:id/approve', async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  const videoID = c.req.param('id');
  const ack = await Video(c.var.db).setStatus({ videoID, status: 'approved' });
  console.log({ ack });
  return new Response(null, { status: 204 });
});

app.get('/v1/todos', async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  if (!user) {
    return new Response('unauthorized', { status: 401 });
  }
  const matchingVideos = await Video(c.var.db).getUnReviewed();

  return new Response(JSON.stringify(matchingVideos));
});

app.get('/v1/search', async (c) => {
  const { q, lang } = c.req.query();

  const matchingVideos = await Video(c.var.db).search({
    keywords: q,
    language: lang,
  });

  return new Response(JSON.stringify(matchingVideos));
});

app.get('/v1/stream/:filename', async (c) => {
  const filename = c.req.param('filename');
  const rangeHeader = c.req.header('range');
  console.log({ rangeHeader, filename });

  const [start, end] =
    rangeHeader !== undefined
      ? c.req.header('range')?.split('=')[1]?.split('-') ?? []
      : [];
  const file =
    end !== undefined
      ? await c.env.R2.get(filename, {
          range: { offset: start, length: Number(end) - Number(start) + 1 },
        })
      : null;
  if (!file) return new Response('not found', { status: 404 });

  const headers = new Headers();
  file.writeHttpMetadata(headers);
  headers.set('etag', file.httpEtag);

  if (file.range) {
    headers.set(
      'content-range',
      `bytes ${file.range.offset}-${file.range.end ?? file.size - 1}/${file.size}`,
    );
  }

  const status = file.body ? (c.req.header('range') !== null ? 206 : 200) : 304;

  const { readable, writable } = new TransformStream();

  file.body.pipeTo(writable);

  return new Response(readable, { headers, status });
});

app.delete('/v1/videos/:id', async (c) => {
  const id = c.req.param('id');
  const deleted = await Video(c.var.db).delete(id);
  await c.env.R2.delete(deleted.filename);

  return new Response(null, { status: 204 });
});

app.get('/v1/logout', async (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Clear-Site-Data': '"cookies"',
    },
  });
});

const currentUID = async (context) => {
  return parse(context.req.raw.headers.get('cookie') || '').gcre_session;
};

const currentUser = async (context) => {
  const uid = await currentUID(context);

  if (uid) {
    const user = await User(context.var.db).withUID(uid);

    if (!user) {
      return null;
    }

    return user;
  }

  return null;
};

export default app;
