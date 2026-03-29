import { DomainsPage } from "@/components/domains-page";
import { db } from "@/lib/db";
import { domains } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function DomainsServerPage() {
  let domainRows: {
    id: string;
    name: string;
    status: string;
    region: string;
    createdAt: string;
  }[] = [];

  try {
    const rows = await db
      .select({
        id: domains.id,
        name: domains.name,
        status: domains.status,
        region: domains.region,
        createdAt: domains.createdAt,
      })
      .from(domains)
      .orderBy(desc(domains.createdAt))
      .limit(200);

    domainRows = rows.map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      region: r.region,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    domainRows = [];
  }

  return <DomainsPage domains={domainRows} />;
}
