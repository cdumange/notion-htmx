import { Knex } from "knex";
import { FizzStats } from "./FizzStats";

export interface Migration {
  Migrate(): Promise<void>;
}

export async function EnsureDB(conn: Knex) {
  const migrations: Migration[] = [new FizzStats(conn)];
  return await Promise.all(migrations.map(async (x) => await x.Migrate()));
}
