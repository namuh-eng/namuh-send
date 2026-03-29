import { ApiKeyDetail } from "@/components/api-key-detail";
import { db } from "@/lib/db";
import { apiKeys, domains, logs } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ApiKeyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [keyResult] = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      permission: apiKeys.permission,
      domainId: apiKeys.domainId,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.id, id))
    .limit(1);

  if (!keyResult) {
    notFound();
  }

  // Fetch domain name, total uses, last used in parallel
  const [domainResult, usesResult, lastUsedResult, domainList] =
    await Promise.all([
      keyResult.domainId
        ? db
            .select({ name: domains.name })
            .from(domains)
            .where(eq(domains.id, keyResult.domainId))
            .limit(1)
        : Promise.resolve([]),
      db.select({ count: count() }).from(logs).where(eq(logs.apiKeyId, id)),
      db
        .select({ createdAt: logs.createdAt })
        .from(logs)
        .where(eq(logs.apiKeyId, id))
        .orderBy(logs.createdAt)
        .limit(1),
      db
        .select({ id: domains.id, name: domains.name })
        .from(domains)
        .orderBy(domains.name),
    ]);

  const domainName = domainResult[0]?.name ?? "All domains";
  const totalUses = usesResult[0]?.count ?? 0;
  const lastUsedAt = lastUsedResult[0]?.createdAt?.toISOString() ?? null;

  return (
    <ApiKeyDetail
      apiKey={{
        id: keyResult.id,
        name: keyResult.name,
        keyPrefix: keyResult.keyPrefix,
        permission: keyResult.permission,
        domainId: keyResult.domainId,
        domainName,
        totalUses,
        lastUsedAt,
        createdAt: keyResult.createdAt.toISOString(),
        creatorEmail: "jaeyunha@foreverbrowsing.com",
      }}
      domains={domainList}
    />
  );
}
