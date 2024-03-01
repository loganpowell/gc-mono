# Gaza Care Medic App

Web app to allow Medics to upload First Aid materials to be served in the First Aid app.

## Tech Stack

Runs on Serverless Cloudflare Pages

## Running locally

The following steps will help you get the app running locally. You will need to install dependencies, run a build and then serve it locally with Cloudflare's wrangler
tool. Since it will run in wrangler, you will need to continuously build after any change is made. You can achieve this via the `--watch` argument to the `wrangler`
command.

- Install dependencies

```
npx yarn install
```

- Start

keep the build running:
```
npx yarn build:dev --watch
```

Run cloudflare pages:
```
npx wrangler pages dev dist
```

The app is now running, the instructions onscreen will have the port where the app will be running. Usually 8788.
