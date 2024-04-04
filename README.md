# Turborepo + `git subtree` + Vite + React

## Instructions

### Hydrate the Cloudflare Local Databases

```sh
pnpm hydrate
```

### Connect the repos to their respective remotes

#### Main repo

```sh
git clone git@github.com:urname/monorepo.git
# git clone <remote-url-or-ssh>
```

#### Using `git subtree` (per app in `apps/`)

```
Upon intially cloning the monorepo, you'll need to delete all the apps
in the `apps/` directory - except for `apps/template`.
This is because the apps are added as subtrees,
and the directories need to be empty before adding the subtrees.
```

Add a new remote for the app

```sh
git remote add api git@github.com:urname/subrepo.git
# git remote add <remote-name> <remote-url-or-ssh>
```

Add the remote as a subtree

```sh
git subtree add --prefix=apps/api api turbo
# git subtree add --prefix=<local-dir> <remote-name> <sync-branch>
```

Pull changes from the remote

```sh
git subtree pull --prefix=apps/api --squash api turbo
# git subtree pull --prefix=<local-dir> --squash <remote-name> <sync-branch>
```

Push changes to the remote

```sh
git subtree push --prefix=apps/api api turbo
# git subtree push --prefix=<local-dir> <remote-name> <sync-branch>
```

Explanation:
Git subtree allows individual directories within this monorepo to be housed as separate repositories. This allows us to both control access to the individual apps and to use Cloudflare pages on those apps - with their nice preview builds built into their github integration.

###### Tip: Add a `git` alias to list the subtrees

```sh
# ~/.gitconfig
[alias]
    subtrees = !"git log | grep git-subtree-dir | awk '{ print $2 }'"
```

Then use it like this:

```sh
git subtrees
```

### Install and Run All Apps (`pnpm`)

```
Turborepo has specific settings per package manager.
This monorepo uses `pnpm` as the package manager,
so you'll need to have it installed globally.
```

Inside this directory, you can run several commands:

```sh
pnpm install
```

Build all apps and packages

```sh
pnpm build
```

Develop all apps and packages

```sh
pnpm dev
```

Lint all apps and packages

```sh
pnpm lint
```

---

## Implementing New `/apps/`

### Port Configuration

in the `apps/api` directory, you'll find a `wrangler.toml` file. In this file, the ports that are allowed by wrangler are set. For example:

```toml
# apps/api/wrangler.toml
...
ALLOWED_ORIGINS = "http://localhost:8787, http://localhost:8788, http://localhost:8789, http://localhost:8080, http://localhost:8090"
...
```

Application (`vite`) ports are set in the `constants.json` file in the root of the monorepo.

```json
// constants.json
{
  "ports": {
    "admin": 8787,
    "app": 8788,
    "medic": 8789,
    "template": 9090
  }
}
```

#### Port Configs for React Apps (Vite)

You'll need to set one of these adjudicated ports for the app to run on. This is done in each `apps/<app>/vite.config.ts` file. For example:

```ts
// apps/app/vite.config.ts
// irrelevant imports omitted for brevity
...
import { getConfig } from "@repo/constants";

export default defineConfig(async () => {
  const {
    constants: {
      ports: { app },
    },
  } = await getConfig();
  return {
    ...
    server: {
      port: app, // from constants.json
      open: true, // open the browser when the server starts
      watch: {
        ignored: ["!**/node_modules/@repo/**"],
      },
    },
    ...
  };
});
```

#### Port Configs for Cloudflare Worker Apps (`wrangler dev`)

To set the port for a Cloudflare worker app, you'll need to set the port in the `wrangler.toml` file. For example:

```toml
# apps/api/wrangler.toml
[dev]
port = 8080
```

**`--show-interactive-dev-session=false`**

```json
// apps/api/package.json
{
  "name": "api",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "npx wrangler dev src/index.ts -e=staging --show-interactive-dev-session=false"
  }
}
```

The `--show-interactive-dev-session=false` flag prevents the below (default) `wrangler dev` cli display:

```sh
[b] open a browser, [d] open Devtools, [l] turn off local mode, [c] clear console, [x] to exit
```

This adds a lot of noise to the terminal and obscures the output of any sibling processes that are running during development.

### Import Aliases

Using **`@`**-prefixed aliases in the app will tend to conflict with the `@repo` alias used in the shared components and utilities in the monorepo.

In order to simplify imports, You can either explicitly define local (not shared between apps in the monorepo) dependencies for each app. Alternatively, you can use a different prefix (e.g., `~` or `#`) for local dependencies.

#### Examples:

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

**or**

```tsx
// apps/web/src/App.tsx
import { Button } from "@ui/button"; // import from ui package
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

In order to get this to work, follow this basic pattern:

#### `tsconfig.json`

```json
// apps/<app>/tsconfig.json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": {
    "baseUrl": ".",
    // for local aliased components (conflicts with turbo aliases)
    "paths": {
      "@*": ["./src/*"],
      "@ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.js"]
}
```

This `extends` the base config shared across all apps and packages in the monorepo, which is located in the `packages/config-typescript/vite.json` file.

#### `vite.config.js`

```ts
// apps/<app>/vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"), // internal aliases
      "@ui": path.resolve(__dirname, "../../packages/ui/src"), // shared component library
    },
  },
  ...
  clearScreen: false, // don't clear the terminal when the app starts
  optimizeDeps: {
    exclude: ["@repo"],
  },
});
```

After setting up the aliases, you should be able to use your aliases without any annoying relative paths or red squiggly lines in your editor 😉

---

## Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript] for static type checking
- [ESLint]for code linting
- [Prettier] for code formatting

[vite]: https://vitejs.dev
[Express]: https://expressjs.com/
[TypeScript]: https://www.typescriptlang.org/
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io
