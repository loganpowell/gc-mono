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
gh repo create gc-mono --public --add-readme
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
gh repo create gc-mono-app --public --add-readme
✓ Created repository urname/gc-mono-app on GitHub
  https://github.com/urname/gc-mono-app

gh repo create gc-mono-admin --public --add-readme
✓ Created repository urname/gc-mono-admin on GitHub
  https://github.com/urname/gc-mono-admin

gh repo create gc-mono-api --public --add-readme
✓ Created repository urname/gc-mono-api on GitHub
  https://github.com/urname/gc-mono-api

```

### Step 3: Initialize git subrepos for each app in the `/apps` directory

> This uses the [`git-subrepo`](https://github.com/ingydotnet/git-subrepo) tool.

#### [Install `git-subrepo`]() if you haven't already
    
```sh
git clone https://github.com/ingydotnet/git-subrepo /path/to/git-subrepo
```

`source` the .rc file. Just add a line like this one to your shell startup script:

```sh
source /path/to/git-subrepo/.rc
```
That will modify your PATH and MANPATH, and also enable command completion.



#### Connect the repos to their respective remotes

##### Main repo

```sh
git remote add origin git@github.com:urname/gc-mono.git
```
#### Initialize the subrepos

Turn an existing subdirectory into a subrepo.
Format:
```sh
git subrepo init <subdir> [-r <remote>] [-b <default-branch>] [--method <merge|rebase>]
```
##### Subrepos

> Before using `git subrepo` commit any uncommitted changes

Now you can initialize the subrepos
```sh
git add .
git commit -m "Initial commit"

git subrepo init apps/app -r git@github.com:urname/gc-mono-app.git -b main
# Subrepo created from 'apps/app' with remote 'git@github.com:urname/gc-mono-app.git' (main).

git subrepo init apps/admin -r git@github.com:urname/gc-mono-admin.git -b main
# Subrepo created from 'apps/admin' with remote 'git@github.com:urname/gc-mono-admin.git' (main).

git subrepo init apps/api -r git@github.com:urname/gc-mono-api.git -b main
# Subrepo created from 'apps/api' with remote 'git@github.com:urname/gc-mono-api.git' (main).
```

###### Verify setup

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

> *You can change subrepo configuration any time with the `config` command.*
>
> ```sh
> git subrepo config <subdir> <option> [<value>] [-f]
> ```
> 
> Changing anything other than `method` requires `--force`
> Example:
> ```sh
> git subrepo config apps/api method rebase
> ```


###### Verify a subrepo configuration setting

```sh
git subrepo config apps/app remote
# Subrepo 'apps/app' option 'remote' has value 'git@github.com:urname/gc-mono-app.git'.
```

#### Push the changes to upstream repos

```sh
git subrepo push --all --force
```

## Install dependencies

```sh
npm install
````

Inside this directory, you can run several commands:

Build all apps and packages

```sh
npm run build
```

Develop all apps and packages

```sh
npm run dev
```

Lint all apps and packages

```sh
npm run lint
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

-   `docs`: a vanilla [vite](https://vitejs.dev) ts app
-   `web`: another vanilla [vite](https://vitejs.dev) ts app
-   `@repo/ui`: a stub component & utility library shared by both `web` and `docs` applications
-   `@repo/eslint-config`: shared `eslint` configurations
-   `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

```

```
