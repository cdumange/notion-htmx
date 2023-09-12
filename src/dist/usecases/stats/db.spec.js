"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typemoq_1 = require("typemoq");
const db_1 = require("./db");
const fizzbuzz_1 = require("../../models/fizzbuzz");
const lodash_1 = require("lodash");
const models_1 = require("../../models");
describe("test DBStatManager", () => {
    it("increment", async () => {
        const req = {
            int1: 3,
            int2: 5,
            str1: "fizz",
            str2: "buzz",
            limit: 100,
        };
        const mockDB = typemoq_1.Mock.ofType();
        mockDB
            .setup((x) => x.UpsertRequest(typemoq_1.It.is((y) => (0, lodash_1.isEqual)(y.request, req) && y.count === 1)))
            .verifiable();
        const s = new db_1.DBStatManager(mockDB.object);
        await s.Increment(req);
        mockDB.verifyAll();
    });
    describe("getMostUsed", () => {
        it("ok", async () => {
            const expected = {
                request: new fizzbuzz_1.FizzbuzzRequest(),
                count: 25,
            };
            const mockDB = typemoq_1.Mock.ofType();
            mockDB
                .setup((x) => x.GetMostUsed())
                .returns(() => Promise.resolve((0, models_1.makeValue)(expected)))
                .verifiable();
            const s = new db_1.DBStatManager(mockDB.object);
            const val = await s.GetMostUsed();
            mockDB.verifyAll();
            expect((0, models_1.isValue)(val));
            expect(val.value).toStrictEqual(expected);
        });
        it("error", async () => {
            const expected = "no stat set";
            const mockDB = typemoq_1.Mock.ofType();
            mockDB
                .setup((x) => x.GetMostUsed())
                .returns(() => Promise.resolve((0, models_1.makeError)(expected)))
                .verifiable();
            const s = new db_1.DBStatManager(mockDB.object);
            const val = await s.GetMostUsed();
            mockDB.verifyAll();
            expect((0, models_1.isError)(val));
            expect(val.error).toStrictEqual(expected);
        });
    });
});
//# sourceMappingURL=db.spec.js.map