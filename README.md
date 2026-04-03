# Namuh Send

An open-source Resend.com clone — full email API, dashboard, domains, broadcasts, templates, webhooks, and TypeScript SDK. Built autonomously by AI agents in 5 hours at Ralphthon Seoul 2026.

> Built with [Ralph-to-Ralph](https://github.com/namuh-eng/ralph-to-ralph) — an autonomous SaaS cloning pipeline. See [`ralph_to_ralph_archive/`](./ralph_to_ralph_archive/) for the full backstory.

---

## What Works

- **Email sending** — REST API + TypeScript SDK, delivered via AWS SES
- **React email templates** — SDK supports `react` prop with `renderToStaticMarkup()`
- **Domain verification** — DKIM/SPF/DMARC auto-configured via Cloudflare API, verified by SES
- **API key management** — create keys with `full_access` or `sending_access` permissions
- **Broadcasts** — block-based rich text editor with slash commands, review panel, send
- **Templates** — create, edit, publish with variable substitution
- **Audience** — contacts, segments, topics, custom properties
- **Webhooks** — register endpoints, 17 event types across 3 categories
- **Metrics** — delivery, open, click, bounce rates with date range filtering
- **Logs** — full send/delivery/event log
- **API docs** — auto-generated at `/docs`
- **Full dashboard** — 10 pages matching Resend's UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS + Radix UI |
| Database | PostgreSQL via Drizzle ORM |
| Email | AWS SES |
| Storage | AWS S3 |
| DNS | Cloudflare API |
| Deployment | AWS App Runner |

---

## Self-Hosting

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS account (SES + S3 + App Runner)
- Cloudflare account (for DNS auto-configuration, optional)

### 1. Clone and install

```bash
git clone https://github.com/namuh-eng/ralph-to-ralph-resend-demo
cd ralph-to-ralph-resend-demo
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/resend_clone
DASHBOARD_KEY=your-secret-key           # master key for dashboard access
CLOUDFLARE_API_TOKEN=                   # optional — enables DNS auto-configure
CLOUDFLARE_ZONE_ID=                     # optional
```

AWS credentials are read from `~/.aws/credentials` (run `aws configure`).

### 3. Run migrations

```bash
npm run db:migrate
```

### 4. Start

```bash
npm run dev   # http://localhost:3015
```

Visit `http://localhost:3015` and enter your `DASHBOARD_KEY` to access the dashboard.

### Deploy to AWS App Runner

```bash
bash scripts/deploy.sh
```

The deploy script builds a Docker image, pushes to ECR, and deploys to App Runner. Requires AWS CLI configured with appropriate permissions.

---

## API Usage

### Send an email

```bash
curl -X POST https://YOUR_HOST/api/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@yourdomain.com",
    "to": ["recipient@example.com"],
    "subject": "Hello!",
    "html": "<h1>It works!</h1>"
  }'
```

### TypeScript SDK

```bash
npm install resend-clone
```

```typescript
import { ResendClone } from "resend-clone";

const client = new ResendClone("YOUR_API_KEY", {
  baseUrl: "https://YOUR_HOST",
});

await client.emails.send({
  from: "hello@yourdomain.com",
  to: "recipient@example.com",
  subject: "Hello from the clone",
  react: <WelcomeEmail name="World" />,
});
```

Full API reference at `YOUR_HOST/docs`.

---

## Development

```bash
make check       # typecheck + lint (Biome)
make test        # unit tests (Vitest)
make test-e2e    # E2E tests (Playwright, requires dev server)
make all         # run everything
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and contribution guidelines.

---

## License

[Elastic License 2.0](./LICENSE) — free to use and self-host; cannot be offered as a competing hosted service.

---

## Built by

- **Jaeyun Ha** — [github.com/jaeyunha](https://github.com/jaeyunha)
- **Ashley Ha** — [github.com/ashley-ha](https://github.com/ashley-ha)

Powered by [Ralph-to-Ralph](https://github.com/namuh-eng/ralph-to-ralph) — point it at any SaaS URL, get a working clone.
