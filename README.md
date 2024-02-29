```
npm install
npm run dev
```

```
npm run deploy
```


Run db migrations locally
```
npx wrangler d1 execute gaza-care-staging --local --file=drizzle/0000_steady_jetstream.sql  -e staging
```

where `0000_steady_jetstream.sql` is the name of the sql migration file.
