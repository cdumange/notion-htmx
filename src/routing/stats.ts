import * as Koa from "koa";
import * as Router from "koa-router";
import { StatManager } from "../usecases/stats";

import { StatusCodes } from "http-status-codes";
import { isError } from "../models";

export function registerStats(api: Koa, statManager: StatManager) {
  const router = new Router({
    prefix: "/stats",
  });

  router.get("/most-viewed", getMostViewed(statManager));

  api.use(router.routes());
  api.use(router.allowedMethods());
}

function getMostViewed(statManager: StatManager) {
  return async (ctx: Koa.Context) => {
    const res = await statManager.GetMostUsed();
    if (isError(res)) {
      ctx.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.response.body = {
        error: res.error,
      };
      return;
    }

    ctx.response.body = res.value;
    ctx.response.status = StatusCodes.OK;
  };
}
