import * as Koa from "koa";
import * as Router from "koa-router";

import { Either, isError } from "../models/either";
import {
  FizzbuzzRequest,
  FizzbuzzResponse,
  FizzBuzzErrors,
} from "../models/fizzbuzz";

import { StatusCodes } from "http-status-codes";
import { StatManager } from "../usecases/stats";

export type functionFizzbuzz = (
  input: FizzbuzzRequest,
) => Either<FizzbuzzResponse, FizzBuzzErrors>;

export function registerFizzbuzz(
  api: Koa,
  fizzbuzz: functionFizzbuzz,
  statManager: StatManager,
) {
  const router: Router = new Router({
    prefix: "/fizzbuzz",
  });

  const statMiddleware = generateStatMiddleware(statManager);

  router.post("/", statMiddleware, async (ctx: Koa.Context): Promise<void> => {
    const request = ctx.request.body as FizzbuzzRequest;
    const resp = fizzbuzz(request);

    if (isError(resp)) {
      ctx.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      return;
    }

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = resp.value;
  });

  api.use(router.routes());
  api.use(router.allowedMethods());
}

function generateStatMiddleware(statManager: StatManager) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    await next();

    if (
      ctx.response.status == StatusCodes.OK &&
      ctx.request.body !== undefined
    ) {
      await statManager.Increment(ctx.request.body as FizzbuzzRequest);
    }
  };
}
