import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import { getPlatformProxy } from "wrangler";

export default defineConfig(async () => {
  const { env, dispose } = await getPlatformProxy();
  return {
    plugins: [
      devServer({
        adapter: {
          env,
          onServerClose: dispose,
        },
      }),
    ],
  };
});

/*
NOTES:
- wrangler.toml config: https://developers.cloudflare.com/workers/wrangler/configuration/
*/
