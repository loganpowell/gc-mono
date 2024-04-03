## Git `subtree`

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

## Trouble Shooting `git-subrepo`

if you get a [`rev-list error`] like this:

```sh
git-subrepo: Command failed: 'git rev-list --reverse --ancestry-path --topo-order xxxxxxxxxxxxx..HEAD'.
```

This can happen on `pull` due to the following being done on your behalf by `git-subrepo`:

```sh
git subrepo fetch <subdir>
git subrepo branch <subdir>
git merge/rebase subrepo/<subdir>/fetch subrepo/<subdir>
git subrepo commit <subdir>
# Only needed for a consequential push:
git update-ref refs/subrepo/<subdir>/pull subrepo/<subdir>
```

If you run into this issue, do these yourself and then run `git subrepo commit <subdir>`.

Read the `git-subrepo` docs to understand the [flags] and [options]

[`rev-list error`]: https://github.com/ingydotnet/git-subrepo/issues/524
[flags]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#command-options
[options]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#output-options
[Install `git-subrepo`]: https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#installation-instructions
