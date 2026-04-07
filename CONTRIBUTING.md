# Contributing

## Setup

**Quick start** (requires Docker + Node.js):

```bash
git clone https://github.com/namuh-eng/namuh-send.git
cd namuh-send
npm install
make setup    # starts Postgres, creates .env, runs migrations, seeds DB
make dev      # http://localhost:3015
```

The seed prints an API key to the console — save it. Then verify everything works:

```bash
# Check the app + database are healthy
curl http://localhost:3015/api/health

# Send a test email (replace YOUR_API_KEY with the key from seed)
curl -X POST http://localhost:3015/api/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@example.com",
    "to": ["test@example.com"],
    "subject": "Hello from namuh-send",
    "text": "It works!"
  }'
```

Without AWS credentials, emails are logged to the console instead of sent — the full API flow still works for development.

<details>
<summary>Manual setup (without make setup)</summary>

1. Copy `.env.example` to `.env` and set `DASHBOARD_KEY` (see the file for a generation command).
2. Start Postgres: `docker compose up -d` (or point `DATABASE_URL` at your own instance).
3. Push schema and seed: `npm run db:push && npm run db:seed`
4. Start dev server: `npm run dev`

</details>

## Ports

- **3015** — dev server (`npm run dev`)
- **8080** — production Docker image (`Dockerfile`). These are intentionally different; the Dockerfile is for deployment via App Runner, not local dev.

## AWS SES (optional for local dev)

AWS credentials are **not required** for local development — without them, emails are logged to the console and the full API flow still works. When you're ready to actually send emails, configure `~/.aws/credentials` via `aws configure`.

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
