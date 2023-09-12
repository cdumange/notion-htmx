"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const inmemory_1 = require("./inmemory");
describe("test inmemory stats", () => {
    describe("test increment", () => {
        it("ok", async () => {
            const s = new inmemory_1.InMemoryStatManager();
            const request = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            expect(async function () {
                await s.Increment(request);
            }).not.toThrowError();
            let v = await s.GetStat(request);
            expect((0, models_1.isValue)(v)).toBe(true);
            expect(v.value.count).toBe(1);
            expect(async function () {
                await s.Increment(request);
            }).not.toThrowError();
            v = await s.GetStat(request);
            expect((0, models_1.isValue)(v)).toBe(true);
            expect(v.value.count).toBe(2);
        });
    });
    describe("test getstat", () => {
        it("ok", async () => {
            const s = new inmemory_1.InMemoryStatManager();
            const request = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            expect(async function () {
                await s.Increment(request);
            }).not.toThrowError();
            const v = await s.GetStat(request);
            expect((0, models_1.isValue)(v));
            expect(v.value.count).toBe(1);
        });
        it("not set", async () => {
            const s = new inmemory_1.InMemoryStatManager();
            const request = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            const v = await s.GetStat(request);
            expect((0, models_1.isError)(v));
            expect(v.error).toBe("no stat set");
        });
    });
    describe("GetMostUsed", () => {
        it("no stat set", async () => {
            const s = new inmemory_1.InMemoryStatManager();
            const v = await s.GetMostUsed();
            expect((0, models_1.isError)(v));
            expect(v.error).toBe("no stat set");
        });
        it("ok", async () => {
            const s = new inmemory_1.InMemoryStatManager();
            const req1 = {
                int1: 0,
                int2: 0,
                str1: "",
                str2: "",
                limit: 0,
            };
            const req2 = {
                int1: 3,
                int2: 5,
                str1: "",
                str2: "",
                limit: 0,
            };
            const expectedCount = 2;
            await s.Increment(req1);
            await s.Increment(req1);
            await s.Increment(req2);
            const v = await s.GetMostUsed();
            expect((0, models_1.isValue)(v));
            expect(v.value.request).toStrictEqual(req1);
            expect(v.value.count).toStrictEqual(expectedCount);
        });
    });
});
//# sourceMappingURL=inmemory.spec.js.map