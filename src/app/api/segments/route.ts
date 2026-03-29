import { db } from "@/lib/db";
import { segments } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await db
      .select({ id: segments.id, name: segments.name })
      .from(segments)
      .orderBy(asc(segments.name));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch segments:", error);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 },
    );
  }
}
