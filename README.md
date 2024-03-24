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

## Subrepos

**REQUIRED: [Install `git-subrepo`]**

Initialize git subrepos for each app in the `/apps` directory

> BEFORE USING `git subrepo`, STASH ANY UNCOMMITTED CHANGES

### Sync Subrepos with the Monorepo

Before you can push changes to subrepos, you'll need to sync all subrepositories with the monorepo. This is a one-time operation.

#### 1: Stash all uncommited changes

```sh
git stash
```

#### 2: Initialize the subrepos

Format:

```sh
git subrepo init <subdir> [-r <remote>] [-b <default-branch>] [--method <merge|rebase>]
```

Example:

```sh
git subrepo init apps/app -r git@github.com:urname/gc-mono-app.git -b main
# Subrepo created from 'apps/app' with remote 'git@github.com:urname/gc-mono-app.git' (main).

git subrepo init apps/admin -r git@github.com:urname/gc-mono-admin.git -b main
# Subrepo created from 'apps/admin' with remote 'git@github.com:urname/gc-mono-admin.git' (main).

git subrepo init apps/api -r git@github.com:urname/gc-mono-api.git -b main
# Subrepo created from 'apps/api' with remote 'git@github.com:urname/gc-mono-api.git' (main).
```

#### 3. Pull changes from the remote

```sh
git subrepo pull --all
```

If you run into any errors, use the `--force` flag to overwrite the local changes with the remote changes. (**hence the need to `stash` changes before initializing the subrepos**)

```sh
git subrepo pull --all --force # should only be needed on the first sync
```

Verify setup

```sh
git subrepo status
4 subrepos:

Git subrepo 'apps/admin':
  Remote URL:      git@github.com:urname/gc-mono-admin.git
  Tracking Branch: main

Git subrepo 'apps/api':
  Remote URL:      git@github.com:urname/gc-mono-api.git
  Tracking Branch: main

Git subrepo 'apps/app':
  Remote URL:      git@github.com:urname/gc-mono-app.git
  Tracking Branch: main

Git subrepo 'apps/medic':
  Remote URL:      git@github.com:urname/gc-mono-medic.git
  Tracking Branch: main
```

#### 4. Pop the stash

```sh
git stash pop
```

#### 5. Commit the changes to the main monorepo

```sh
git add .
git commit -m "Initial commit"
git push origin main
```

#### 6. Push the changes to upstream repos

```sh
git subrepo push --all
```

_You can change subrepo configuration any time with the `config` command._

```sh
git subrepo config <subdir> <option> [<value>] [-f]
```

Example:

```sh
git subrepo config apps/api method rebase
```

_Changing anything other than the subrepo's default `method` requires using `--force`_

**From this point on, you should be able to pull/push changes to subrepos using the `--all` flag**

### `pull`

Format:

```sh
git subrepo pull <subdir>|--all [-M|-R|-f] [-m <msg>] [--file=<msg file>] [-e] [-b <branch>] [-r <remote>] [-u]
```

Example:

```sh
git subrepo pull --all -b dev -m "fix: bug"
```

### `push`

Format:

```sh
git subrepo push <subdir>|--all [<branch>] [-m msg] [--file=<msg file>] [-r <remote>] [-b <branch>] [-M|-R] [-u] [-f] [-s] [-N]
```

Example:

```sh
git subrepo push --all -b dev -m "fix: bug"
```

Read the `git-subrepo` docs to understand the [flags] and [options]

[flags]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#command-options
[options]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#output-options
[Install `git-subrepo`]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#installation-instructions

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

## What's inside the Turborepo?

This Turborepo includes the following packages and apps:

### Apps and Packages

-   `api`: an [Express] server
-   `app`: a vanilla [vite] ts app
-   `admin`: another vanilla [vite] ts app
-   `@repo/jest-presets`: Jest configurations
-   `@repo/logger`: isomorphic logger (a small wrapper around console.log)
-   `@repo/ui`: a stub component & utility library shared by both `admin` and `app` applications
-   `@repo/eslint-config`: shared `eslint` configurations
-   `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript].

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript] for static type checking
-   [ESLint]for code linting
-   [Prettier] for code formatting

[vite]: https://vitejs.dev
[Express]: https://expressjs.com/
[TypeScript]: https://www.typescriptlang.org/
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io
