"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestKoa = void 0;
const _ = require("lodash");
const fizzbuzz_1 = require("./fizzbuzz");
const request = require("supertest");
const http_status_codes_1 = require("http-status-codes");
const TypeMoq = require("typemoq");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
function getTestKoa() {
    const api = new Koa();
    api.use(bodyParser());
    return api;
}
exports.getTestKoa = getTestKoa;
describe("test fizzbuzz endpoint", () => {
    describe("post", () => {
        it("200", async () => {
            const api = getTestKoa();
            const input = {
                int1: 3,
                int2: 5,
                str1: "fizz",
                str2: "buzz",
                limit: 10,
            };
            const expected = {
                result: [],
            };
            const mockFizz = (i) => {
                if (_.isEqual(i, input)) {
                    return { value: expected };
                }
                return {
                    error: "limit is too great",
                };
            };
            const mockStat = TypeMoq.Mock.ofType();
            (0, fizzbuzz_1.registerFizzbuzz)(api, mockFizz, mockStat.object);
            const res = await request(api.callback())
                .post("/fizzbuzz")
                .send(input)
                .expect(http_status_codes_1.StatusCodes.OK);
            expect(res.body).toStrictEqual(expected);
            mockStat.verify((x) => x.Increment(TypeMoq.It.is((y) => _.isEqual(y, input))), TypeMoq.Times.once());
        });
        it("500", async () => {
            const api = getTestKoa();
            const input = {
                int1: 3,
                int2: 5,
                str1: "fizz",
                str2: "buzz",
                limit: 10,
            };
            const mockFizz = () => {
                return {
                    error: "limit is too great",
                };
            };
            const mockStat = TypeMoq.Mock.ofType();
            (0, fizzbuzz_1.registerFizzbuzz)(api, mockFizz, mockStat.object);
            await request(api.callback())
                .post("/fizzbuzz")
                .send(input)
                .expect(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            mockStat.verify((x) => x.Increment, TypeMoq.Times.never());
        });
    });
});
//# sourceMappingURL=fizzbuzz.spec.js.map