import { knex, Knex } from "knex";
import { FizzStats } from "./FizzStats";
import { EnsureDB } from "./migrations";

const default_port = 5432;
const default_host = "localhost";
const default_username = "postgres";
const default_db = "public";

export const getTestConnection = (): Knex => {
  const host = process.env.DB_HOST || default_host;
  const conn = knex({
    client: "pg",
    connection: {
      host: host,
      port: default_port,
      user: default_username,
      database: default_db,
    },
  });
  return conn;
};

describe("test migrations", () => {
  const conn = getTestConnection();
  beforeEach(async () => {
    await conn.schema.dropTableIfExists(FizzStats.TableName);
  });

  test("FizzStats", async () => {
    const fizz = new FizzStats(conn);
    await fizz.Migrate();

    //should not crash if relaunched
    await fizz.Migrate();
    await conn.select("*").from(FizzStats.TableName);
  });

  test("global", async () => {
    await EnsureDB(conn);
    await conn.select("*").from(FizzStats.TableName);
  });

  afterAll(async () => {
    await conn.destroy();
  });
});
