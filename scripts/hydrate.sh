# cd into the api directory
(cd apps/api

# print pwd
pwd

for file in drizzle/*.sql
# print file
do
    echo $file
    npx wrangler d1 execute gaza-care-staging --file=$file -e staging
done)