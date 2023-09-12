"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStats = void 0;
const Router = require("koa-router");
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
function registerStats(api, statManager) {
    const router = new Router({
        prefix: "/stats",
    });
    router.get("/most-viewed", getMostViewed(statManager));
    api.use(router.routes());
    api.use(router.allowedMethods());
}
exports.registerStats = registerStats;
function getMostViewed(statManager) {
    return async (ctx) => {
        const res = await statManager.GetMostUsed();
        if ((0, models_1.isError)(res)) {
            ctx.response.status = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.response.body = {
                error: res.error,
            };
            return;
        }
        ctx.response.body = res.value;
        ctx.response.status = http_status_codes_1.StatusCodes.OK;
    };
}
//# sourceMappingURL=stats.js.map