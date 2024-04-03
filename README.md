# Turborepo + Vite + git-subrepo

# Instructions

## Scaffolding the Turborepo

### Create a new Turborepo (with Vite template)

Create a new directory and cd into it:

```sh
mkdir <my-turbosub> && cd <my-turbosub>
```

Generate the turborepo example with the Vite template:

| PM     | Command                                     |
| ------ | ------------------------------------------- |
| `pnpm` | `pnpm dlx create-turbo@latest -e with-vite` |
| `npm`  | `npx create-turbo@latest -e with-vite`      |

When prompted to choose a folder, select the current directory `.`

## Creating the repositories for the turborepo and each app

> Note: We are using the [github cli](https://cli.github.com/), but you can also do this manually via the github website

### Create the monorepo repository

Format:

```sh
gh repo create <unique-repo-name-for-turborepo> [flags]
```

Example:

```sh
gh repo create gc-mono --public
✓ Created repository urname/gc-mono on GitHub
  https://github.com/urname/gc-mono
```

### Create separate repos for each app in the `/apps` directory

Format:

```sh
gh repo create <unique-repo-name-for-each-app> [flags]
```

Example:

```sh
gh repo create gc-mono-app --public
✓ Created repository urname/gc-mono-app on GitHub
  https://github.com/urname/gc-mono-app

gh repo create gc-mono-admin --public
✓ Created repository urname/gc-mono-admin on GitHub
  https://github.com/urname/gc-mono-admin

gh repo create gc-mono-api --public
✓ Created repository urname/gc-mono-api on GitHub
  https://github.com/urname/gc-mono-api

```

# Connect the repos to their respective remotes

## Main repo

```sh
git remote add origin git@github.com:urname/gc-mono.git
```

# Install and Run All Apps

```sh
pnpm install
```

Inside this directory, you can run several commands:

Build all apps and packages

```sh
pnpm run build
```

Develop all apps and packages

```sh
pnpm run dev
```

Lint all apps and packages

```sh
pnpm run lint
```

---

# Implementing New `/apps/`

The components of this framework include:

- Vite.js
- TypeScript
- React
- Cloudflare:
  - Workers
  - Pages
  - D1
  - R2
  - Stream (video)
  - Wrangler (cli)
- hono

## Port Configuration

in the `apps/api` directory, you'll find a `wrangler.toml` file. In this file, the ports that are allowed by wrangler are set. For example:

```toml
# apps/api/wrangler.toml
...
ALLOWED_ORIGINS = "http://localhost:8787, http://localhost:8788, http://localhost:8789, http://localhost:8080, http://localhost:8090"
...
```

### Port Configs for React Apps (Vite)

You'll need to set one of these adjudicated ports for the app to run on. This is done in each `apps/<app>/vite.config.ts` file. For example:

```ts
// apps/app/vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8788,
    open: true, // open the browser for the app when the server starts
  },
  clearScreen: false, // prevents clearing the terminal (default is true)
  optimizeDeps: {
    exclude: ["@repo"],
  },
});
```

The `clearScreen` option is set to `false` to prevent the terminal from being cleared when the app is started. This is useful when you have multiple apps running in the same terminal.

The `open` option is set to `true` to open the browser for the app when the server starts.

### Port Configs for Cloudflare Worker Apps (Wrangler)

To set the port for a Cloudflare worker app, you'll need to set the port in the `wrangler.toml` file. For example:

```toml
[dev]
port = 8080
```

#### `--show-interactive-dev-session=false`

```json
{
  "name": "api",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "npx wrangler dev src/index.ts -e=staging --show-interactive-dev-session=false"
  }
}
```

The `--show-interactive-dev-session=false` flag prevents the default `wrangler dev` behavior of displaying interactive options:

```sh
[b] open a browser, [d] open Devtools, [l] turn off local mode, [c] clear console, [x] to exit
```

This adds a lot of noise to the terminal and obscures the output of any sibling processes that are running during development.

### Import Aliases

Using `@`-prefixed aliases in the app will tend to conflict with the `@repo` alias used in the shared components and utilities in the monorepo.

In order to simplify imports, You can either explicitly define local (not shared between apps in the monorepo) dependencies for each app. Or you can use an alternative prefix (e.g., `~` or `#`) for local dependencies.

The advantages of using a prefix different from `@` are:

- You don't have to worry about conflicts with the `@repo` alias
- It's easier to distinguish between local and shared dependencies

#### Aliases Examples:

_Using explicit local dependencies:_

```ts
// apps/admin/routes/index.tsx
import App from '@components/App'
import Home from '@components/Home'
import Login from '@components/Login'

const routes = {
  path: '/',
  element: <App />,
  children: [
    { index: true, element: <Home /> },
    { path: '/login', element: <Login /> },
  ],
}

export { routes }
```

In order to get this to work, follow this basic pattern:

```json
// packages/ui/tsconfig.json
{
  "extends": "@config/tsconfig.react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ui/*": ["./src/*"] // no other project in the monorepo uses this alias
    }
  },
  "include": ["."]
}
```

```json
// apps/<app>/tsconfig.json
{
  "extends": "@config/tsconfig.react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["../../packages/ui/src/*"]
    }
  },
  "exclude": ["node_modules", "public"],
  "include": ["."]
}
```

```ts
// apps/<app>/vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    port: 8788,
    open: true,
    watch: {
      ignored: ["!**/node_modules/@repo/**"],
    },
  },
  clearScreen: false,
  optimizeDeps: {
    exclude: ["@repo"],
  },
});
```

```tsx
// apps/web/src/App.tsx
import { Button } from "@ui"; // import from ui package
import { AppLayout } from "@layouts"; // internal import using alias for apps/web/src/layouts path

export function App() {
  return (
    <AppLayout>
      <h1>My Web App</h1>
      <Button onClick={() => alert("You clicked me!")}>Click Me</Button>
    </AppLayout>
  );
}
```

This `extends` the base config shared across all apps and packages in the monorepo, which is located in the `packages/config-typescript/vite.json` file.

After setting up the aliases, you should be able to use your aliases without any annoying relative paths or red squiggly lines in your editor 😉

---

## What's inside the Turborepo?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an [Express] server
- `app`: a vanilla [vite] ts app
- `admin`: another vanilla [vite] ts app
- `@repo/jest-presets`: Jest configurations
- `@repo/logger`: isomorphic logger (a small wrapper around console.log)
- `@repo/ui`: a stub component & utility library shared by both `admin` and `app` applications
- `@repo/eslint-config`: shared `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript].

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript] for static type checking
- [ESLint]for code linting
- [Prettier] for code formatting

[vite]: https://vitejs.dev
[Express]: https://expressjs.com/
[TypeScript]: https://www.typescriptlang.org/
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io
