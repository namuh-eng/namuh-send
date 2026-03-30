import { unauthorizedResponse, validateApiKey } from "@/lib/api-auth";
import { type NextRequest, NextResponse } from "next/server";

// The properties table does not exist in the production database.
// This route returns empty results for backward compatibility.

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  return NextResponse.json({
    data: [],
    total: 0,
  });
}

export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  return NextResponse.json(
    { error: "Properties table is not available" },
    { status: 501 },
  );
}
