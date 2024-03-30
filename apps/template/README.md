# Template

Copy this template to create a new app in the monorepo.

## Instructions

1. Copy the template to a new directory in the `apps` directory.
2. Update the `name` field in the `package.json` file to the name of the new app.
3. Add the new app as a `--filter` in the root `package.json` file.
4. `cd` into the directory and run `pnpm install`.

## Adding as a `git-subrepo`

Follow the instructions in the [README](../../README.md#create-separate-repos-for-each-app-in-the-apps-directory) to add the new app as a `git-subrepo`.
