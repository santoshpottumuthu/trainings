# Training Records Management

A Next.js App Router application for public training-record browsing and authenticated administrator record management. Video links are optional HTTPS URLs visible to all readers and editable by administrators.

## Stack

- Next.js App Router and TypeScript
- PostgreSQL with Prisma ORM
- Auth.js Credentials, bcryptjs, and Zod
- Tailwind CSS and shadcn/ui

## Local setup

1. Install Node.js 22.13 or newer (or Node.js 20.19 or newer) and npm.
2. Create a PostgreSQL database. Neon is recommended for deployment; a local PostgreSQL instance also works.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` to the pooled PostgreSQL URL and `DIRECT_URL` to the direct URL. Keep `.env` private.
4. Generate an Auth.js secret locally, for example with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`, and set `AUTH_SECRET`. Set `AUTH_URL` to `http://localhost:3000` for local development.
5. Install and initialize:

   ```powershell
   npm install
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

Administrator initialization uses `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from the private `.env`; the seed process hashes the password. There is no public registration.

For local UI work only, `ENABLE_DEV_ADMIN_LOGIN=true` enables the separate `DEV_ADMIN_USERNAME` / `DEV_ADMIN_PASSWORD` pair without a database account. It is rejected unless `NODE_ENV=development`; never enable it in production. This bypass permits signing in to the admin UI but does not provide database access for saving records.

## Database URLs and pooling

For Neon/serverless runtime access, use the Neon **pooled** endpoint in `DATABASE_URL` (pooler hostname) and include `sslmode=require`, `pgbouncer=true`, and a conservative `connection_limit` as shown in `.env.example`. Use the direct endpoint in `DIRECT_URL` for Prisma migrations and seed operations. Never commit actual URLs or credentials.

## Commands

- `npm run dev` — local development server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run build` — production build
- `npm run db:generate` — generate Prisma Client
- `npm run db:migrate` — create/apply a local development migration
- `npm run db:deploy` — apply committed migrations in deployment
- `npm run db:seed` — create or update the initial administrator

## Deployment and operations

Production hosting is intended for Vercel with PostgreSQL hosted by Neon. Configure the environment variables in the hosting provider rather than committing secrets, run `npm run db:deploy` as the deployment migration step, then verify the public and administrator workflows against the deployed URL. Schedule and test database backups using the database provider's backup/restore facilities. Production deployment and restore instructions will be completed after authorized provider configuration is available.
