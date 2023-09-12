import * as TypeMoq from "typemoq";
import * as request from "supertest";

import { StatManager } from "../usecases/stats";
import { registerStats } from "./stats";
import { StatusCodes } from "http-status-codes";
import { RequestStat } from "../models/Stats";
import { makeError, makeValue } from "../models";
import { getTestKoa } from "./fizzbuzz.spec";

describe("test getmostviewed", () => {
  it("200", async () => {
    const expected: RequestStat = {
      request: {
        int1: 3,
        int2: 5,
        str1: "fizz",
        str2: "buzz",
        limit: 100,
      },
      count: 25,
    };
    const api = getTestKoa();
    const statManager = TypeMoq.Mock.ofType<StatManager>();
    statManager
      .setup((x) => x.GetMostUsed())
      .returns(() => Promise.resolve(makeValue(expected)));

    registerStats(api, statManager.object);

    const res = await request(api.callback()).get("/stats/most-viewed");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toStrictEqual(expected);
    statManager.verify((x) => x.GetMostUsed(), TypeMoq.Times.once());
  });

  it("500", async () => {
    const api = getTestKoa();
    const statManager = TypeMoq.Mock.ofType<StatManager>();
    statManager
      .setup((x) => x.GetMostUsed())
      .returns(() => Promise.resolve(makeError("error retrieving stats")));

    registerStats(api, statManager.object);

    const res = await request(api.callback()).get("/stats/most-viewed");
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    statManager.verify((x) => x.GetMostUsed(), TypeMoq.Times.once());
  });
});
