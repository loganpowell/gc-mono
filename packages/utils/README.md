# `@repo/config`

## Installation

1. cd into your package or app
2. Add to `package.json`:

```json
  "dependencies": {
    "@repo/config": "workspace:*"
  }
```

3. Run `pnpm install`

## Basic Usage

```ts
import { getConfig } from "@repo/config";
const someFunction = async () => {
  const { constants, isLocal } = await getConfig();

  // get shared constants
  const { ports } = constants;

  // check if running locally
  if (isLocal) {
    // do something in local environment
  } else {
    // do something else in production
  }
};
```
