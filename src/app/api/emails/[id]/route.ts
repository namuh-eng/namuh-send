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
      last_event: email.status,
      scheduled_at: email.scheduledAt,
      tags: email.tags,
      created_at: email.createdAt,
      status: email.status,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to retrieve email";
    return Response.json({ error: message }, { status: 500 });
  }
}
