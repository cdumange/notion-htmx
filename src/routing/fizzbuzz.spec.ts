import * as _ from "lodash";
import { functionFizzbuzz, registerFizzbuzz } from "./fizzbuzz";
import {
  FizzBuzzErrors,
  FizzbuzzRequest,
  FizzbuzzResponse,
} from "../models/fizzbuzz";
import { Either } from "../models/either";
import * as request from "supertest";
import { StatusCodes } from "http-status-codes";

import * as TypeMoq from "typemoq";
import { StatManager } from "../usecases/stats";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

export function getTestKoa(): Koa {
  const api = new Koa();
  api.use(bodyParser());
  return api;
}

describe("test fizzbuzz endpoint", () => {
  describe("post", () => {
    it("200", async () => {
      const api = getTestKoa();

      const input: FizzbuzzRequest = {
        int1: 3,
        int2: 5,
        str1: "fizz",
        str2: "buzz",
        limit: 10,
      };
      const expected: FizzbuzzResponse = {
        result: [],
      };

      const mockFizz = (
        i: FizzbuzzRequest,
      ): Either<FizzbuzzResponse, FizzBuzzErrors> => {
        if (_.isEqual(i, input)) {
          return { value: expected };
        }

        return {
          error: "limit is too great",
        };
      };

      const mockStat = TypeMoq.Mock.ofType<StatManager>();

      registerFizzbuzz(api, mockFizz, mockStat.object);

      const res = await request(api.callback())
        .post("/fizzbuzz")
        .send(input)
        .expect(StatusCodes.OK);
      expect(res.body as FizzbuzzResponse).toStrictEqual(expected);

      mockStat.verify(
        (x) => x.Increment(TypeMoq.It.is((y) => _.isEqual(y, input))),
        TypeMoq.Times.once(),
      );
    });

    it("500", async () => {
      const api = getTestKoa();

      const input: FizzbuzzRequest = {
        int1: 3,
        int2: 5,
        str1: "fizz",
        str2: "buzz",
        limit: 10,
      };

      const mockFizz: functionFizzbuzz = (): Either<
        FizzbuzzResponse,
        FizzBuzzErrors
      > => {
        return {
          error: "limit is too great",
        };
      };

      const mockStat = TypeMoq.Mock.ofType<StatManager>();

      registerFizzbuzz(api, mockFizz, mockStat.object);

      await request(api.callback())
        .post("/fizzbuzz")
        .send(input)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      mockStat.verify((x) => x.Increment, TypeMoq.Times.never());
    });
  });
});
