# Gaza Care Admin App

Web app to allow Admins to review uploaded First Aid materials to be served in
the First Aid app.

## Tech Stack

Runs on Serverless Cloudflare Pages

## Running locally

### Start the `api` server

The app requires a server to be running to serve the data. The server is
available in the `api` repository. Follow the instructions in the `api` README

### `.dev.vars` File

Copy the `.dev.vars.example` file to `.dev.vars` and fill in the variables
delineated with `<variable-name>` with the appropriate values. Ask a team member
for the values.

The following steps will help you get the app running locally. You will need to
install dependencies, run a build and then serve it locally with Cloudflare's
wrangler tool. Since it will run in wrangler, you will need to continuously
build after any change is made.

You can achieve this via the `--watch` argument to the `wrangler` command.

-   Install dependencies

```sh
npx yarn install
# or
npm i
```

-   Start

Enable Hot Module Replacement (HMR) by running the following command:

```sh
npx yarn build:dev --watch

```

Run cloudflare pages:

```sh
npx wrangler pages dev dist
```

The app is now running, the instructions onscreen will have the port where the
app will be running. Usually 8788.
