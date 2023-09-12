"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFizzbuzz = void 0;
const Router = require("koa-router");
const either_1 = require("../models/either");
const http_status_codes_1 = require("http-status-codes");
function registerFizzbuzz(api, fizzbuzz, statManager) {
    const router = new Router({
        prefix: "/fizzbuzz",
    });
    const statMiddleware = generateStatMiddleware(statManager);
    router.post("/", statMiddleware, async (ctx) => {
        const request = ctx.request.body;
        const resp = fizzbuzz(request);
        if ((0, either_1.isError)(resp)) {
            ctx.response.status = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
            return;
        }
        ctx.response.status = http_status_codes_1.StatusCodes.OK;
        ctx.response.body = resp.value;
    });
    api.use(router.routes());
    api.use(router.allowedMethods());
}
exports.registerFizzbuzz = registerFizzbuzz;
function generateStatMiddleware(statManager) {
    return async (ctx, next) => {
        await next();
        if (ctx.response.status == http_status_codes_1.StatusCodes.OK &&
            ctx.request.body !== undefined) {
            await statManager.Increment(ctx.request.body);
        }
    };
}
//# sourceMappingURL=fizzbuzz.js.map