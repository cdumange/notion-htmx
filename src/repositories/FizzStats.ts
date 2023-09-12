import { Knex } from "knex";
import { Migration } from "./migrations";
import { ErrGetMostUsed, RequestStat } from "../models/Stats";
import { Either, makeError, makeValue } from "../models";

export interface FizzStatsRepository {
  UpsertRequest(stat: RequestStat): Promise<void>;
  GetMostUsed(): Promise<Either<RequestStat, ErrGetMostUsed>>;
}

export class FizzStats implements Migration, FizzStatsRepository {
  private db: Knex;
  public static readonly TableName = "fizz_stats";

  constructor(db: Knex) {
    this.db = db;
  }

  async Migrate() {
    if (!(await this.db.schema.hasTable(FizzStats.TableName))) {
      await this.db.schema.createTable(FizzStats.TableName, (table) => {
        table.string("request").primary();
        table.integer("count").index("index_fizzstats_count");
      });
    }
  }

  async UpsertRequest(stat: RequestStat) {
    await this.db.raw(
      `INSERT INTO ${FizzStats.TableName} (request, count)
      VALUES (:request, :count)
      ON CONFLICT(request)
      DO UPDATE
      SET count = ${FizzStats.TableName}.count + :count;`,
      { request: JSON.stringify(stat.request), count: stat.count },
    );
  }

  async GetMostUsed(): Promise<Either<RequestStat, ErrGetMostUsed>> {
    const req: RequestStat[] = await this.db<FizzStats>(FizzStats.TableName)
      .select("request", "count")
      .orderBy("count", "desc")
      .limit(1);

    if (req.length === 0) {
      return makeError("no stat set");
    }
    return makeValue(req[0]);
  }
}
