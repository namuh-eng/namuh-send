import { ApiKeysList } from "@/components/api-keys-list";
import { db } from "@/lib/db";
import { apiKeys, domains } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function ApiKeysPage() {
  const [keys, domainList] = await Promise.all([
    db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permission: apiKeys.permission,
        domainId: apiKeys.domainId,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.createdAt)),
    db
      .select({ id: domains.id, name: domains.name })
      .from(domains)
      .orderBy(domains.name),
  ]);

  return (
    <ApiKeysList
      keys={keys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        permission: k.permission,
        lastUsedAt: null,
        createdAt: k.createdAt.toISOString(),
      }))}
      domains={domainList}
    />
  );
}
