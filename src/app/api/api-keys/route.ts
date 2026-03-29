import { createHash, randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { apiKeys, domains } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

// ── GET /api/api-keys ────────────────────────────────────────────
// Internal dashboard endpoint — no API key auth required (dashboard key auth)

export async function GET(): Promise<Response> {
  try {
    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permission: apiKeys.permission,
        domainId: apiKeys.domainId,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.createdAt));

    return Response.json({ data: keys });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to list API keys";
    return Response.json({ error: message }, { status: 500 });
  }
}

// ── POST /api/api-keys ───────────────────────────────────────────

interface CreateApiKeyBody {
  name: string;
  permission?: "full_access" | "sending_access";
  domain_id?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: CreateApiKeyBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name || body.name.trim().length === 0) {
    return Response.json({ error: "name is required" }, { status: 422 });
  }

  // Validate domain_id if provided
  if (body.domain_id) {
    const domain = await db.query.domains.findFirst({
      where: eq(domains.id, body.domain_id),
    });
    if (!domain) {
      return Response.json({ error: "Domain not found" }, { status: 404 });
    }
  }

  try {
    // Generate API key: re_ prefix + UUID
    const rawKey = `re_${randomUUID().replace(/-/g, "")}`;
    const hashedKey = createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = `${rawKey.slice(0, 12)}...`;

    const [created] = await db
      .insert(apiKeys)
      .values({
        name: body.name.trim(),
        hashedKey,
        keyPrefix,
        permission: body.permission ?? "full_access",
        domainId: body.domain_id ?? null,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permission: apiKeys.permission,
        domainId: apiKeys.domainId,
        createdAt: apiKeys.createdAt,
      });

    return Response.json({
      id: created.id,
      name: created.name,
      token: rawKey,
      key_prefix: created.keyPrefix,
      permission: created.permission,
      domain_id: created.domainId,
      created_at: created.createdAt,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create API key";
    return Response.json({ error: message }, { status: 500 });
  }
}
