"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestConnection = void 0;
const knex_1 = require("knex");
const FizzStats_1 = require("./FizzStats");
const migrations_1 = require("./migrations");
const default_port = 5432;
const default_host = "localhost";
const default_username = "postgres";
const default_db = "public";
const getTestConnection = () => {
    const host = process.env.DB_HOST || default_host;
    const conn = (0, knex_1.knex)({
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
exports.getTestConnection = getTestConnection;
describe("test migrations", () => {
    const conn = (0, exports.getTestConnection)();
    beforeEach(async () => {
        await conn.schema.dropTableIfExists(FizzStats_1.FizzStats.TableName);
    });
    test("FizzStats", async () => {
        const fizz = new FizzStats_1.FizzStats(conn);
        await fizz.Migrate();
        //should not crash if relaunched
        await fizz.Migrate();
        await conn.select("*").from(FizzStats_1.FizzStats.TableName);
    });
    test("global", async () => {
        await (0, migrations_1.EnsureDB)(conn);
        await conn.select("*").from(FizzStats_1.FizzStats.TableName);
    });
    afterAll(async () => {
        await conn.destroy();
    });
});
//# sourceMappingURL=migrations.spec.js.map