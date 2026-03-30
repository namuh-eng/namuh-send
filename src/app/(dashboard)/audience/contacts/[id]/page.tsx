import { ContactDetail } from "@/components/contact-detail";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (!contact) {
      notFound();
    }

    const contactData = {
      id: contact.id,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      status: (contact.unsubscribed ? "unsubscribed" : "subscribed") as
        | "subscribed"
        | "unsubscribed",
      segments: ((contact.segments as string[]) ?? []).map((s) => ({
        id: s,
        name: s,
      })),
      topics: (
        (contact.topicSubscriptions as Array<{
          topicId: string;
          subscribed: boolean;
        }>) ?? []
      ).map((t) => ({
        id: t.topicId,
        name: t.topicId,
      })),
      properties: (contact.customProperties || {}) as Record<string, string>,
      createdAt: contact.createdAt.toISOString(),
      activity: [
        {
          type: "Contact created",
          timestamp: contact.createdAt.toISOString(),
        },
      ],
    };

    return <ContactDetail contact={contactData} />;
  } catch {
    notFound();
  }
}
