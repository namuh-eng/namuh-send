import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { webhooks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

interface CreateWebhookBody {
  url: string;
  event_types: string[];
}

function validateCreateBody(body: CreateWebhookBody): string | null {
  if (!body.url) return "url is required";
  if (
    !body.event_types ||
    !Array.isArray(body.event_types) ||
    body.event_types.length === 0
  ) {
    return "event_types array is required";
  }
  return null;
}

export async function GET(request: Request): Promise<Response> {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || 20, 1),
    100,
  );

  try {
    const results = await db
      .select({
        id: webhooks.id,
        url: webhooks.url,
        eventTypes: webhooks.eventTypes,
        status: webhooks.status,
        createdAt: webhooks.createdAt,
      })
      .from(webhooks)
      .orderBy(desc(webhooks.createdAt))
      .limit(limit);

    return Response.json({
      object: "list",
      data: results.map((w) => ({
        id: w.id,
        endpoint: w.url,
        events: w.eventTypes,
        active: w.status === "active",
        created_at: w.createdAt,
      })),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to list webhooks";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  let body: CreateWebhookBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateCreateBody(body);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 422 });
  }

  try {
    const [webhook] = await db
      .insert(webhooks)
      .values({
        url: body.url,
        eventTypes: body.event_types,
      })
      .returning();

    return Response.json(
      {
        id: webhook.id,
        endpoint: webhook.url,
        events: webhook.eventTypes,
        active: webhook.status === "active",
        created_at: webhook.createdAt,
      },
      { status: 201 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create webhook";
    return Response.json({ error: message }, { status: 500 });
  }
}
