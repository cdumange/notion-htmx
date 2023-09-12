"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const FizzStats_1 = require("./FizzStats");
const migrations_1 = require("./migrations");
const migrations_spec_1 = require("./migrations.spec");
describe("test FizzStats DAO", () => {
    const conn = (0, migrations_spec_1.getTestConnection)();
    describe("test UpsertRequest", () => {
        beforeEach(async () => {
            await (0, migrations_1.EnsureDB)(conn);
            await conn(FizzStats_1.FizzStats.TableName).delete();
        });
        test("test different", async () => {
            const s = new FizzStats_1.FizzStats(conn);
            const req1 = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            const req2 = {
                int1: 1,
                int2: 3,
                str1: "",
                str2: "",
                limit: 0,
            };
            await s.UpsertRequest({ request: req1, count: 1 });
            await s.UpsertRequest({ request: req2, count: 5 });
            const res = await conn(FizzStats_1.FizzStats.TableName)
                .select("*")
                .where("request", "=", JSON.stringify(req1));
            expect(res.length).toStrictEqual(1);
            expect(res[0].count).toStrictEqual(1);
        });
        test("two times the same", async () => {
            const s = new FizzStats_1.FizzStats(conn);
            const req1 = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            await s.UpsertRequest({ request: req1, count: 1 });
            await s.UpsertRequest({ request: req1, count: 5 });
            const res = await conn(FizzStats_1.FizzStats.TableName)
                .select("*")
                .where("request", "=", JSON.stringify(req1));
            expect(res.length).toStrictEqual(1);
            expect(res[0].count).toStrictEqual(6);
        });
    });
    describe("test GetMostUsed", () => {
        beforeEach(async () => {
            await (0, migrations_1.EnsureDB)(conn);
            await conn(FizzStats_1.FizzStats.TableName).delete();
        });
        test("no lines", async () => {
            const s = new FizzStats_1.FizzStats(conn);
            const res = await s.GetMostUsed();
            expect((0, models_1.isError)(res));
            expect(res.error).toBe("no stat set");
        });
    });
    afterAll(async () => {
        await conn.destroy();
    });
});
//# sourceMappingURL=FizzStats.spec.js.map