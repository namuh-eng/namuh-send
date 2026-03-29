import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { emailEvents, emails } from "@/lib/db/schema";
import { sendEmail as sesSendEmail } from "@/lib/ses";
import { desc, eq, gt, lt } from "drizzle-orm";

// ── Validation ────────────────────────────────────────────────────

interface SendEmailBody {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  headers?: Record<string, string>;
  attachments?: Array<{ filename: string; content: string }>;
  tags?: Array<{ name: string; value: string }>;
  scheduled_at?: string;
}

function normalizeToArray(
  value: string | string[] | undefined,
): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

function validateSendBody(body: SendEmailBody): string | null {
  if (!body.from) return "from is required";
  if (!body.to) return "to is required";
  if (!body.subject) return "subject is required";
  if (!body.html && !body.text) return "html or text body is required";
  return null;
}

// ── POST /api/emails ──────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  let body: SendEmailBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateSendBody(body);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 422 });
  }

  const to = normalizeToArray(body.to) as string[];
  const cc = normalizeToArray(body.cc);
  const bcc = normalizeToArray(body.bcc);
  const replyTo = normalizeToArray(body.reply_to);

  try {
    // Send via SES
    const sesResult = await sesSendEmail({
      from: body.from,
      to,
      cc,
      bcc,
      subject: body.subject,
      html: body.html,
      text: body.text,
      replyTo,
      headers: body.headers,
      attachments: body.attachments,
    });

    // Store in DB
    const [email] = await db
      .insert(emails)
      .values({
        from: body.from,
        to,
        cc: cc ?? null,
        bcc: bcc ?? null,
        replyTo: replyTo?.[0] ?? null,
        subject: body.subject,
        html: body.html ?? null,
        text: body.text ?? null,
        tags: body.tags ?? null,
        lastEvent: "sent",
        scheduledAt: body.scheduled_at ? new Date(body.scheduled_at) : null,
        apiKeyId: auth.apiKeyId,
        sesMessageId: sesResult.id,
      })
      .returning({ id: emails.id });

    // Record sent event
    await db.insert(emailEvents).values({
      emailId: email.id,
      type: "sent",
    });

    return Response.json({ id: email.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return Response.json({ error: message }, { status: 500 });
  }
}

// ── GET /api/emails ───────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || 20, 1),
    100,
  );
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");

  try {
    let query = db
      .select({
        id: emails.id,
        from: emails.from,
        to: emails.to,
        subject: emails.subject,
        cc: emails.cc,
        bcc: emails.bcc,
        replyTo: emails.replyTo,
        lastEvent: emails.lastEvent,
        scheduledAt: emails.scheduledAt,
        createdAt: emails.createdAt,
      })
      .from(emails);

    if (after) {
      query = query.where(gt(emails.id, after)) as typeof query;
    } else if (before) {
      query = query.where(lt(emails.id, before)) as typeof query;
    }

    const results = await query
      .orderBy(desc(emails.createdAt))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    return Response.json({
      object: "list",
      has_more: hasMore,
      data: data.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        cc: e.cc,
        bcc: e.bcc,
        reply_to: e.replyTo,
        last_event: e.lastEvent,
        scheduled_at: e.scheduledAt,
        created_at: e.createdAt,
      })),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to list emails";
    return Response.json({ error: message }, { status: 500 });
  }
}
