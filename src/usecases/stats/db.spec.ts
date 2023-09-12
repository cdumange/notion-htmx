import { It, Mock } from "typemoq";
import { FizzStatsRepository } from "../../repositories/FizzStats";
import { DBStatManager } from "./db";
import { FizzbuzzRequest } from "../../models/fizzbuzz";
import { isEqual } from "lodash";
import { ErrGetMostUsed, RequestStat } from "../../models/Stats";
import exp = require("constants");
import { isError, isValue, makeError, makeValue } from "../../models";

describe("test DBStatManager", () => {
  it("increment", async () => {
    const req: FizzbuzzRequest = {
      int1: 3,
      int2: 5,
      str1: "fizz",
      str2: "buzz",
      limit: 100,
    };
    const mockDB = Mock.ofType<FizzStatsRepository>();
    mockDB
      .setup((x) =>
        x.UpsertRequest(It.is((y) => isEqual(y.request, req) && y.count === 1)),
      )
      .verifiable();
    const s = new DBStatManager(mockDB.object);

    await s.Increment(req);

    mockDB.verifyAll();
  });

  describe("getMostUsed", () => {
    it("ok", async () => {
      const expected: RequestStat = {
        request: new FizzbuzzRequest(),
        count: 25,
      };

      const mockDB = Mock.ofType<FizzStatsRepository>();
      mockDB
        .setup((x) => x.GetMostUsed())
        .returns(() => Promise.resolve(makeValue(expected)))
        .verifiable();
      const s = new DBStatManager(mockDB.object);

      const val = await s.GetMostUsed();

      mockDB.verifyAll();
      expect(isValue(val));
      expect(val.value).toStrictEqual(expected);
    });

    it("error", async () => {
      const expected: ErrGetMostUsed = "no stat set";

      const mockDB = Mock.ofType<FizzStatsRepository>();
      mockDB
        .setup((x) => x.GetMostUsed())
        .returns(() => Promise.resolve(makeError(expected)))
        .verifiable();
      const s = new DBStatManager(mockDB.object);

      const val = await s.GetMostUsed();

      mockDB.verifyAll();
      expect(isError(val));
      expect(val.error).toStrictEqual(expected);
    });
  });
});
