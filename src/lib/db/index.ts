// Database client — will be configured by build agent once DATABASE_URL is set
// Pre-created so imports work from the start

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
