import { parse } from "cookie";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import * as jose from "jose";

import * as schema from "../db/schema";
import { User, UserIdentity, AuthProvider, Video } from "./models";

const app = new Hono();

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) =>
      c.env.ALLOWED_ORIGINS.split(", ").includes(origin) ||
      origin.endsWith("medic-eev.pages.dev") ||
      origin.endsWith("admin-93h.pages.dev") ||
      origin.endsWith("gaza-care.com")
        ? origin
        : "https://gaza-care.com",
    allowHeaders: ["Content-Type", "Authorization", "x-highlight-request"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });

  return await corsMiddleware(c, next);
});

app.options("*", (c) => {
  return new Response(null, { status: 204 });
});

app.use("*", async (context, next) => {
  const db = drizzle(context.env.DB, { schema });
  context.set("db", db);
  await next();
});

const authenticate = async (c) => {
  return await currentUser(c);
};

app.post("/v1/auth/google/success", async (c) => {
  const { creds, userType } = await c.req.raw.json();
  const credentials = jose.decodeJwt(creds);

  let authProvider = await AuthProvider(c.var.db).create({ name: "google" });
  authProvider ||= await AuthProvider(c.var.db).withName({ name: "google" });
  let user = await currentUser(c);

  if (!user) {
    const uid = crypto.randomUUID();
    const username = `goog-${credentials.sub}`;
    user = await User(c.var.db).create({ username, uid, userType });
    if (user) {
      const identity = await UserIdentity(c.var.db).create({
        userID: user.id,
        authProviderID: authProvider.id,
        providerUserID: credentials.sub,
        profile: JSON.stringify(credentials),
      });
    }
    if (!user) {
      user = await User(c.var.db).withUsername(username);
    }
  }

  return new Response(
    JSON.stringify({ ...user, profile: JSON.stringify({ ...credentials }) }),
    {
      headers: {
        "Set-Cookie": `gcre_session=${user.uid};Path=/;SameSite=Strict;Secure;HttpOnly`,
      },
    },
  );
});

app.get("/v1/session", async (c) => {
  const user = await currentUser(c);

  if (user) {
    return new Response(JSON.stringify(user), { status: 200 });
  }

  return new Response("unauthorized", { status: 401 });
});

app.post("/v1/videos", async (c) => {
  const user = await authenticate(c);

  const formData = await c.req.raw.formData();
  const file = formData.get("file");
  const metadata = JSON.parse(await formData.get("metadata"));
  const language = metadata.language.split("-")[0];

  const fileData = await file?.arrayBuffer();
  const digest = await crypto.subtle.digest("MD5", fileData);
  const bytes = Array.from(new Uint8Array(digest));
  const md5 = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");

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

app.get("/v1/videos", async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  const matchingVideos = await Video(c.var.db).getByUploader(user.id);

  return new Response(JSON.stringify(matchingVideos));
});

app.post("/v1/videos/:id/approve", async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  const videoID = c.req.param("id");
  const ack = await Video(c.var.db).setStatus({ videoID, status: "approved" });
  console.log({ ack });
  return new Response(null, { status: 204 });
});

app.get("/v1/todos", async (c) => {
  const user = await currentUser(c);
  // check if user is admin
  if (!user) {
    return new Response("unauthorized", { status: 401 });
  }
  const matchingVideos = await Video(c.var.db).getUnReviewed();

  return new Response(JSON.stringify(matchingVideos));
});

app.get("/v1/search", async (c) => {
  const { q, lang } = c.req.query();

  const matchingVideos = await Video(c.var.db).search({
    keywords: q,
    language: lang,
  });

  return new Response(JSON.stringify(matchingVideos));
});

app.get("/v1/stream/:filename", async (c) => {
  const filename = c.req.param("filename");
  const file = await c.env.R2.get(filename);

  if (!file) return new Response("not found", { status: 404 });

  const { readable, writable } = new TransformStream();

  file.body.pipeTo(writable);

  return new Response(readable, writable);
});

app.delete("/v1/videos/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await Video(c.var.db).delete(id);
  await c.env.R2.delete(deleted.filename);

  return new Response(null, { status: 204 });
});

app.get("/v1/logout", async (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Clear-Site-Data": '"cookies"',
    },
  });
});

const currentUID = async (context) => {
  return parse(context.req.raw.headers.get("cookie") || "").gcre_session;
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
