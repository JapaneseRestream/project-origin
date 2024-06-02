# Migration

https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#migration-workflows

## Initial migration

```
npx wrangler d1 migrations create [database name] [migration name]

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output [created migration file]
```

## Update migration

```
npx wrangler d1 migrations create [database name] [migration name]

npx prisma migrate diff \
  --from-local-d1 \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output [created migration file]
```

## Apply migration

```
npx wrangler d1 migrations apply [database name] --local
# or
npx wrangler d1 migrations apply [database name] --remote
```
