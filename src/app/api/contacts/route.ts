import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { emails } = body as {
      emails: string[];
    };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "emails array is required" },
        { status: 400 },
      );
    }

    const created: string[] = [];

    for (const email of emails) {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed) continue;

      const [inserted] = await db
        .insert(contacts)
        .values({ email: trimmed })
        .returning({ id: contacts.id });

      if (inserted) {
        created.push(inserted.id);
      }
    }

    return NextResponse.json({ created: created.length, ids: created });
  } catch (error) {
    console.error("Failed to create contacts:", error);
    return NextResponse.json(
      { error: "Failed to create contacts" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit")) || 40),
  );
  const status = url.searchParams.get("status") || "";
  const offset = (page - 1) * limit;

  try {
    let query = db
      .select({
        id: contacts.id,
        email: contacts.email,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        unsubscribed: contacts.unsubscribed,
        segments: contacts.segments,
        createdAt: contacts.createdAt,
      })
      .from(contacts);

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(contacts.email, `%${search}%`),
          ilike(contacts.firstName, `%${search}%`),
          ilike(contacts.lastName, `%${search}%`),
        ),
      );
    }

    if (status === "subscribed") {
      conditions.push(eq(contacts.unsubscribed, false));
    } else if (status === "unsubscribed") {
      conditions.push(eq(contacts.unsubscribed, true));
    }

    if (conditions.length > 0) {
      for (const condition of conditions) {
        if (condition) {
          query = query.where(condition) as typeof query;
        }
      }
    }

    const rows = await query
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset);

    const data = rows.map((c) => ({
      id: c.id,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      status: c.unsubscribed
        ? ("unsubscribed" as const)
        : ("subscribed" as const),
      segments: (c.segments as string[]) ?? [],
      createdAt: c.createdAt,
    }));

    // Get total count
    let countQuery = db.$count(contacts);
    if (search) {
      countQuery = db.$count(
        contacts,
        or(
          ilike(contacts.email, `%${search}%`),
          ilike(contacts.firstName, `%${search}%`),
          ilike(contacts.lastName, `%${search}%`),
        ),
      );
    }
    if (status === "subscribed") {
      countQuery = db.$count(contacts, eq(contacts.unsubscribed, false));
    } else if (status === "unsubscribed") {
      countQuery = db.$count(contacts, eq(contacts.unsubscribed, true));
    }

    const total = await countQuery;

    return NextResponse.json({
      data,
      total: Number(total),
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
