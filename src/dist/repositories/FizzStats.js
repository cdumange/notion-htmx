"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FizzStats = void 0;
const models_1 = require("../models");
class FizzStats {
    constructor(db) {
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
    async UpsertRequest(stat) {
        await this.db.raw(`INSERT INTO ${FizzStats.TableName} (request, count)
      VALUES (:request, :count)
      ON CONFLICT(request)
      DO UPDATE
      SET count = ${FizzStats.TableName}.count + :count;`, { request: JSON.stringify(stat.request), count: stat.count });
    }
    async GetMostUsed() {
        const req = await this.db(FizzStats.TableName)
            .select("request", "count")
            .orderBy("count", "desc")
            .limit(1);
        if (req.length === 0) {
            return (0, models_1.makeError)("no stat set");
        }
        return (0, models_1.makeValue)(req[0]);
    }
}
exports.FizzStats = FizzStats;
FizzStats.TableName = "fizz_stats";
//# sourceMappingURL=FizzStats.js.map