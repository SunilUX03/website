# How to Set Up This Project on the Server

Follow these steps in order. You should have received the code (as a zip
or a git clone — either way, the uploaded photos/documents are already
included inside its `public/media` and `public/documents` folders, no
separate zip needed) and a `.sql` file (the database). You'll also get
some secret values (passwords/keys) separately — keep those private.

## Step 1: Unzip the code

Unzip the project. Open a terminal and go into that folder.

## Step 2: Set up the database

You need Postgres installed and a database created. If you're installing
Postgres yourself on this server (rather than using a managed database),
here's how to create the database and get your connection string:

```
sudo -u postgres createuser tnega --pwprompt   # sets a password when asked
sudo -u postgres createdb tnega -O tnega
```

Your connection string is then:

```
postgresql://tnega:the-password-you-set@localhost:5432/tnega
```

Use this **exact same value** for both `DATABASE_URL` and
`DATABASE_URL_UNPOOLED` in Step 4 — the "pooled vs unpooled" difference
only matters for managed cloud databases (like Neon/Vercel Postgres),
not a plain local Postgres install.

Now load the provided `.sql` file into your new database:

```
psql "postgresql://tnega:the-password-you-set@localhost:5432/tnega" -f tnega_backup.sql
```

## Step 3: Confirm the photos/documents came with the code

The uploaded photos and PDFs are already included in the code itself —
check that `public/media/` and `public/documents/` inside the project
folder are not empty. Nothing to unzip or copy here; this step is just
a sanity check before moving on.

## Step 4: Add the secret values

Copy the file `.env.example` and rename the copy to `.env`. Open it and
fill in the real values you were given for:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `AUTH_SECRET`
- `PAYLOAD_SECRET`

(What each one means is explained in the table further down.)

## Step 5: Install and build

Run these commands one at a time:

```
npm install
npm run build
```

## Step 6: Set up the database tables

Run these once:

```
npm run db:migrate
npm run cms:migrate
```

## Step 7: Start the app

Don't just run `npm run dev` — use `npm start` instead, and keep it
running with a tool like **pm2** so it restarts automatically if it
crashes or the server reboots:

```
npm start
```
or, with pm2:
```
pm2 start npm --name tnega -- start
```

## Step 8: Put it behind a domain with HTTPS

Set up nginx or Caddy in front of the app so it's reachable at your
domain with HTTPS.

**Important:** in your nginx/Caddy config, increase the max upload size
setting (in nginx this is called `client_max_body_size`). If you skip
this, photo uploads on the site will fail once they're bigger than a
couple MB, even though the app itself allows bigger files.

## What each secret value means

| Name | What it is |
|---|---|
| `DATABASE_URL` | The main connection to the database. |
| `DATABASE_URL_UNPOOLED` | A second connection to the *same* database, used only when running the setup commands in Step 6. |
| `AUTH_SECRET` | A random password-like string that keeps login sessions secure for the Careers/jobs section (`/admin`). Any long random text works. |
| `PAYLOAD_SECRET` | Same idea as above, but for the main CMS login (`/cms`) — a separate login system from `/admin`. |

You don't need to set anything for file storage — uploaded photos just
save directly onto this server's disk (in the `public/media` and
`public/documents` folders from Step 3). Just make sure those folders
are **backed up regularly** — they're the only copy of those files.

## Final check — make sure everything works

Go through this list after setup:

- [ ] Open `/cms/login` and log in with an existing account
- [ ] Open any Service or Announcement and check its photo shows up
      (this proves Step 3 worked)
- [ ] Upload a **new** test photo through the CMS and confirm it appears
      in the `public/media` folder on the server
- [ ] Open `/admin` and log in — this is the separate Careers/HR system
- [ ] Fill out a test job application on the public Careers page and
      check it shows up under `/admin`
