import { LogsListPage } from "@/components/logs-list-page";
import { db } from "@/lib/db";
import { logs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function LogsPage() {
  let logRows: {
    id: string;
    method: string | null;
    endpoint: string | null;
    statusCode: number | null;
    createdAt: string;
  }[] = [];

  try {
    const rows = await db
      .select({
        id: logs.id,
        method: logs.method,
        endpoint: logs.endpoint,
        status: logs.status,
        createdAt: logs.createdAt,
      })
      .from(logs)
      .orderBy(desc(logs.createdAt))
      .limit(200);

    logRows = rows.map((r) => ({
      id: r.id,
      method: r.method,
      endpoint: r.endpoint,
      statusCode: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    logRows = [];
  }

  return <LogsListPage logs={logRows} />;
}
