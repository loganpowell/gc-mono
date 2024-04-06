// vite.config.js
import { resolve } from "path";
import { defineConfig } from "file:///Users/logan/Documents/projects/volunteer/monorepo/node_modules/.pnpm/vite@5.2.6_@types+node@20.11.30/node_modules/vite/dist/node/index.js";
import react from "file:///Users/logan/Documents/projects/volunteer/monorepo/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.6/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/logan/Documents/projects/volunteer/monorepo/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.4.3_vite@5.2.6/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { getConfig } from "file:///Users/logan/Documents/projects/volunteer/monorepo/packages/constants/dist/index.js";
var __vite_injected_original_dirname = "/Users/logan/Documents/projects/volunteer/monorepo/apps/admin";
var vite_config_default = defineConfig(async ({ command, mode }) => {
  const { constants } = await getConfig();
  const {
    ports: { admin }
  } = constants;
  console.log("Constants", constants);
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      "process.env": process.env
    },
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src/"),
        "@ui": resolve(__vite_injected_original_dirname, "../../packages/ui/src")
      }
    },
    server: {
      port: admin,
      open: true,
      watch: {
        ignored: ["!**/node_modules/@repo/**"]
      }
    },
    clearScreen: false
    // The watched package must be excluded from optimization,
    // so that it can appear in the dependency graph and trigger hot reload.
    // optimizeDeps: {
    //   exclude: ["@repo"],
    // },
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbG9nYW4vRG9jdW1lbnRzL3Byb2plY3RzL3ZvbHVudGVlci9tb25vcmVwby9hcHBzL2FkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbG9nYW4vRG9jdW1lbnRzL3Byb2plY3RzL3ZvbHVudGVlci9tb25vcmVwby9hcHBzL2FkbWluL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sb2dhbi9Eb2N1bWVudHMvcHJvamVjdHMvdm9sdW50ZWVyL21vbm9yZXBvL2FwcHMvYWRtaW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIkByZXBvL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IHsgY29uc3RhbnRzIH0gPSBhd2FpdCBnZXRDb25maWcoKTtcbiAgY29uc3Qge1xuICAgIHBvcnRzOiB7IGFkbWluIH0sXG4gIH0gPSBjb25zdGFudHM7XG4gIGNvbnNvbGUubG9nKFwiQ29uc3RhbnRzXCIsIGNvbnN0YW50cyk7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIHRzY29uZmlnUGF0aHMoKV0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBcInByb2Nlc3MuZW52XCI6IHByb2Nlc3MuZW52LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9cIiksXG4gICAgICAgIFwiQHVpXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL3BhY2thZ2VzL3VpL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IGFkbWluLFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIGlnbm9yZWQ6IFtcIiEqKi9ub2RlX21vZHVsZXMvQHJlcG8vKipcIl0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICAgIC8vIFRoZSB3YXRjaGVkIHBhY2thZ2UgbXVzdCBiZSBleGNsdWRlZCBmcm9tIG9wdGltaXphdGlvbixcbiAgICAvLyBzbyB0aGF0IGl0IGNhbiBhcHBlYXIgaW4gdGhlIGRlcGVuZGVuY3kgZ3JhcGggYW5kIHRyaWdnZXIgaG90IHJlbG9hZC5cbiAgICAvLyBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyAgIGV4Y2x1ZGU6IFtcIkByZXBvXCJdLFxuICAgIC8vIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVcsU0FBUyxlQUFlO0FBQ2pZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGlCQUFpQjtBQUoxQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsT0FBTyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ3ZELFFBQU0sRUFBRSxVQUFVLElBQUksTUFBTSxVQUFVO0FBQ3RDLFFBQU07QUFBQSxJQUNKLE9BQU8sRUFBRSxNQUFNO0FBQUEsRUFDakIsSUFBSTtBQUNKLFVBQVEsSUFBSSxhQUFhLFNBQVM7QUFDbEMsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxJQUNsQyxRQUFRO0FBQUEsTUFDTixlQUFlLFFBQVE7QUFBQSxJQUN6QjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFBQSxRQUM5QixPQUFPLFFBQVEsa0NBQVcsdUJBQXVCO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsMkJBQTJCO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQUEsSUFDQSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTWY7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
