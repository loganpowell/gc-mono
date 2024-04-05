import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { getConfig } from "@repo/constants";

export default defineConfig(async ({ command, mode }) => {
  const { constants } = await getConfig();
  const {
    ports: { admin },
  } = constants;
  console.log("Constants", constants);
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      "process.env": process.env,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src/"),
        "@ui": resolve(__dirname, "../../packages/ui/src"),
      },
    },
    server: {
      port: admin,
      open: true,
      watch: {
        ignored: ["!**/node_modules/@repo/**"],
      },
    },
    clearScreen: false,
    // The watched package must be excluded from optimization,
    // so that it can appear in the dependency graph and trigger hot reload.
    // optimizeDeps: {
    //   exclude: ["@repo"],
    // },
  };
});
