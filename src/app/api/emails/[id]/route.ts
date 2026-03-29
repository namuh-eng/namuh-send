import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { emails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  const { id } = await params;

  try {
    const email = await db.query.emails.findFirst({
      where: eq(emails.id, id),
      with: {
        events: true,
      },
    });

    if (!email) {
      return Response.json({ error: "Email not found" }, { status: 404 });
    }

    return Response.json({
      object: "email",
      id: email.id,
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      cc: email.cc,
      bcc: email.bcc,
      reply_to: email.replyTo,
      last_event: email.lastEvent,
      scheduled_at: email.scheduledAt,
      tags: email.tags,
      created_at: email.createdAt,
      events: email.events.map((e) => ({
        type: e.type,
        timestamp: e.timestamp,
        data: e.data,
      })),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to retrieve email";
    return Response.json({ error: message }, { status: 500 });
  }
}
