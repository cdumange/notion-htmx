"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeMoq = require("typemoq");
const request = require("supertest");
const stats_1 = require("./stats");
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const fizzbuzz_spec_1 = require("./fizzbuzz.spec");
describe("test getmostviewed", () => {
    it("200", async () => {
        const expected = {
            request: {
                int1: 3,
                int2: 5,
                str1: "fizz",
                str2: "buzz",
                limit: 100,
            },
            count: 25,
        };
        const api = (0, fizzbuzz_spec_1.getTestKoa)();
        const statManager = TypeMoq.Mock.ofType();
        statManager
            .setup((x) => x.GetMostUsed())
            .returns(() => Promise.resolve((0, models_1.makeValue)(expected)));
        (0, stats_1.registerStats)(api, statManager.object);
        const res = await request(api.callback()).get("/stats/most-viewed");
        expect(res.status).toBe(http_status_codes_1.StatusCodes.OK);
        expect(res.body).toStrictEqual(expected);
        statManager.verify((x) => x.GetMostUsed(), TypeMoq.Times.once());
    });
    it("500", async () => {
        const api = (0, fizzbuzz_spec_1.getTestKoa)();
        const statManager = TypeMoq.Mock.ofType();
        statManager
            .setup((x) => x.GetMostUsed())
            .returns(() => Promise.resolve((0, models_1.makeError)("error retrieving stats")));
        (0, stats_1.registerStats)(api, statManager.object);
        const res = await request(api.callback()).get("/stats/most-viewed");
        expect(res.status).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        statManager.verify((x) => x.GetMostUsed(), TypeMoq.Times.once());
    });
});
//# sourceMappingURL=stats.spec.js.map