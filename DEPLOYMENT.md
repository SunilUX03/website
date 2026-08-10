# Deployment Guide — Server Handover

This document is for whoever is setting up this project on a new server. It
covers what the project is, how to install it, what each environment
variable means, and how to bring the existing database and uploaded files
across from the previous hosting (Vercel).

## What this project is

A Next.js app with two separate backend systems sharing one Postgres
database:

- **The main site + CMS** (Payload CMS, mounted at `/cms`) — manages nearly
  all site content (Services, Announcements, Media, etc.) and login is
  separate from the item below.
- **Careers / HR backend** (`/admin`, via Prisma + NextAuth) — job
  applications and HR login. A separate login system from the CMS above,
  sharing the same Postgres database with its own tables.

Uploaded photos/documents (Media and Documents collections in the CMS) are
stored on the server's own local disk, under `public/media/` and
`public/documents/` — **not** in any external service. This requires the
server to have a persistent disk that survives restarts and redeploys.

## Prerequisites

- Node.js 20 or later
- A Postgres database (the restored `.sql` dump — see below)
- A reverse proxy (nginx or Caddy) for HTTPS and routing
- A process manager (pm2 or systemd) to keep the app running

## Setup steps

1. **Unzip the project** and `cd` into it.

2. **Restore the database.** Import the provided `.sql` dump into your own
   Postgres instance:
   ```
   psql "your-new-database-url" -f tnega_backup.sql
   ```

3. **Copy in the uploaded files.** These must keep their **original
   filenames** — the database records reference them by filename, so
   renaming breaks the links. Two ways to get them:
   - If you were handed a folder of files already sorted into
     `media`/`documents`, just copy them into `public/media/` and
     `public/documents/`.
   - Otherwise, run `scripts/download-blob-files.mjs` (from the *old*
     Vercel-hosted setup, with its `BLOB_READ_WRITE_TOKEN`) to pull every
     file straight out of Vercel Blob into the right folders automatically:
     ```
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... node scripts/download-blob-files.mjs
     ```

4. **Set up environment variables.** Copy `.env.sample` to `.env` (or wire
   the same keys into your process manager/systemd config) and fill in real
   values — see the variable reference below.

5. **Install dependencies and build:**
   ```
   npm install
   npm run build
   ```

6. **Run the database migrations** (safe to run even against the restored
   dump — confirms both systems' migration-tracking tables agree with the
   schema):
   ```
   npm run db:migrate
   npm run cms:migrate
   ```

7. **Start the app** under a process manager rather than running it
   directly, so it restarts on crash/reboot:
   ```
   npm start
   ```
   (e.g. `pm2 start npm --name tnega -- start`)

8. **Put a reverse proxy in front of it** (nginx/Caddy) for your domain and
   HTTPS. Important: raise the proxy's own request body size limit (nginx's
   `client_max_body_size`) — it has its own cap separate from the app's,
   and will reject large uploads with its own error before they even reach
   Next.js.

## Environment variable reference

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | The Postgres connection string the app queries through at runtime (Prisma's pooled connection). Point this at your restored database. |
| `DATABASE_URL_UNPOOLED` | A **direct** (non-pooled) connection to the same database. Only used for running migrations — pooled/PgBouncer connections don't support the prepared statements migrations need. |
| `AUTH_SECRET` | Signs login session tokens for the Careers/HR backend (`/admin`). Any long random string works — generate one with `openssl rand -base64 32`. Must be the same value everywhere the app runs, or existing logged-in sessions become invalid. |
| `PAYLOAD_SECRET` | Same idea as `AUTH_SECRET`, but for the CMS's own login (`/cms`) — a completely separate login system. Generate the same way. |
| `PAYLOAD_CONFIG_PATH` | Set to `src/payload.config.ts`. Only used locally when running Payload's own CLI commands (`npm run cms:migrate:create`); not needed at runtime. |

There is **no** file-storage variable to set — uploads go straight to local
disk (see "What this project is" above). Just make sure `public/media/`
and `public/documents/` are writable by whatever user runs the Node
process, and are backed up regularly (they're the only copy of those
files).

## Post-deploy checklist

- [ ] Visit `/cms/login` and confirm you can log in with an existing CMS
      account
- [ ] Open an existing Service/Announcement/etc. and confirm its photo
      loads (proves the copied files + database are lined up correctly)
- [ ] Upload a **new** test photo through the CMS and confirm it appears in
      `public/media/` on the server's disk
- [ ] Visit `/admin` and confirm the Careers/HR login still works
- [ ] Submit a test job application on the public Careers page and confirm
      it appears under `/admin`
