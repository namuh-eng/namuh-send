# Contributing

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/namuh-eng/namuh-send.git
   cd namuh-send
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   At minimum, set `DASHBOARD_KEY` (see the example file for a generation command).

3. Start Postgres (requires Docker):
   ```bash
   docker compose up -d
   ```
   This starts a Postgres 16 container on port 5432. The default `DATABASE_URL` in `.env.example` already points to it. If you prefer your own Postgres instance, update `DATABASE_URL` in `.env` instead.

4. Run migrations and seed the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   The seed creates a sample API key (printed to the console — save it), a domain, and a contact so the dashboard isn't empty.

5. Start the dev server:
   ```bash
   npm run dev
   # App runs at http://localhost:3015
   ```

## Ports

- **3015** — dev server (`npm run dev`)
- **8080** — production Docker image (`Dockerfile`). These are intentionally different; the Dockerfile is for deployment via App Runner, not local dev.

## AWS SES sandbox

New AWS accounts start in SES **sandbox mode** — you can only send emails to verified addresses. If sending fails with an access error:

1. Go to the [SES console](https://console.aws.amazon.com/ses/) and verify a recipient email under "Verified identities"
2. For full sending, request production access via "Account dashboard" > "Request production access"

This is an AWS limitation, not a bug in namuh-send.

## scripts/start.sh

This script is for the **Ralph-to-Ralph autonomous cloning pipeline**, not for starting the app. To run the app locally, use `npm run dev`.

## Development

- `make check` — typecheck + lint/format (Biome)
- `make test` — unit tests (Vitest)
- `make test-e2e` — E2E tests (Playwright, requires dev server running)
- `make all` — run everything

Run `make check && make test` before opening a PR.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript strict mode — no `any` types
- **Styling:** Tailwind CSS + Radix UI
- **Database:** Postgres via Drizzle ORM
- **Email:** AWS SES
- **Storage:** AWS S3

## Code style

- Biome handles formatting — run `make check` to auto-fix
- TypeScript strict mode — no `any`, no type assertions without justification
- Every feature needs at least one unit test (Vitest) and one E2E test (Playwright)

## Pull requests

- Keep PRs focused — one feature or fix per PR
- Include tests for any new functionality
- Run `make check && make test` and confirm both pass before submitting
