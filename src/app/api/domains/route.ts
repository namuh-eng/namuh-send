import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { domains } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, region = "us-east-1" } = body as {
      name: string;
      region?: string;
    };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(domains)
      .values({
        name: name.trim(),
        region,
        status: "not_started",
      })
      .returning({
        id: domains.id,
        name: domains.name,
        status: domains.status,
        region: domains.region,
        createdAt: domains.createdAt,
      });

    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("Failed to create domain:", error);
    return NextResponse.json(
      { error: "Failed to create domain" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  try {
    const rows = await db
      .select({
        id: domains.id,
        name: domains.name,
        status: domains.status,
      })
      .from(domains)
      .orderBy(desc(domains.createdAt));

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("Failed to fetch domains:", error);
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 },
    );
  }
}
