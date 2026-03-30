import { ApiKeysList } from "@/components/api-keys-list";
import { db } from "@/lib/db";
import { apiKeys, domains } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function ApiKeysPage() {
  let keys: {
    id: string;
    name: string;
    tokenPreview: string | null;
    permission: string;
    domain: string | null;
    createdAt: Date;
  }[] = [];
  let domainList: { id: string; name: string }[] = [];

  try {
    [keys, domainList] = await Promise.all([
      db
        .select({
          id: apiKeys.id,
          name: apiKeys.name,
          tokenPreview: apiKeys.tokenPreview,
          permission: apiKeys.permission,
          domain: apiKeys.domain,
          createdAt: apiKeys.createdAt,
        })
        .from(apiKeys)
        .orderBy(desc(apiKeys.createdAt)),
      db
        .select({ id: domains.id, name: domains.name })
        .from(domains)
        .orderBy(domains.name),
    ]);
  } catch {
    keys = [];
    domainList = [];
  }

  return (
    <ApiKeysList
      keys={keys.map((k) => ({
        id: k.id,
        name: k.name,
        tokenPreview: k.tokenPreview ?? "",
        permission: k.permission as "full_access" | "sending_access",
        lastUsedAt: null,
        createdAt: k.createdAt.toISOString(),
      }))}
      domains={domainList}
    />
  );
}
