import { EmailDetail } from "@/components/email-detail";
import { db } from "@/lib/db";
import { emailEvents, emails } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [emailResult] = await db
      .select()
      .from(emails)
      .where(eq(emails.id, id))
      .limit(1);

    if (!emailResult) {
      notFound();
    }

    const events = await db
      .select({
        type: emailEvents.type,
        timestamp: emailEvents.timestamp,
      })
      .from(emailEvents)
      .where(eq(emailEvents.emailId, id))
      .orderBy(asc(emailEvents.timestamp));

    const emailData = {
      id: emailResult.id,
      from: emailResult.from,
      to: emailResult.to,
      subject: emailResult.subject,
      html: emailResult.html,
      text: emailResult.text,
      createdAt: emailResult.createdAt.toISOString(),
      events: events.map((e) => ({
        type: e.type,
        timestamp: e.timestamp.toISOString(),
      })),
    };

    return <EmailDetail email={emailData} />;
  } catch {
    notFound();
  }
}
