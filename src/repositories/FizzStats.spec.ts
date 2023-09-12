import { isError } from "../models";
import { RequestStat } from "../models/Stats";
import { FizzbuzzRequest } from "../models/fizzbuzz";
import { FizzStats } from "./FizzStats";
import { EnsureDB } from "./migrations";
import { getTestConnection } from "./migrations.spec";

describe("test FizzStats DAO", () => {
  const conn = getTestConnection();

  describe("test UpsertRequest", () => {
    beforeEach(async () => {
      await EnsureDB(conn);
      await conn(FizzStats.TableName).delete();
    });

    test("test different", async () => {
      const s = new FizzStats(conn);
      const req1: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };
      const req2: FizzbuzzRequest = {
        int1: 1,
        int2: 3,
        str1: "",
        str2: "",
        limit: 0,
      };
      await s.UpsertRequest({ request: req1, count: 1 });
      await s.UpsertRequest({ request: req2, count: 5 });

      const res: RequestStat[] = await conn(FizzStats.TableName)
        .select("*")
        .where("request", "=", JSON.stringify(req1));

      expect(res.length).toStrictEqual(1);
      expect(res[0].count).toStrictEqual(1);
    });

    test("two times the same", async () => {
      const s = new FizzStats(conn);
      const req1: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };

      await s.UpsertRequest({ request: req1, count: 1 });
      await s.UpsertRequest({ request: req1, count: 5 });

      const res: RequestStat[] = await conn(FizzStats.TableName)
        .select("*")
        .where("request", "=", JSON.stringify(req1));

      expect(res.length).toStrictEqual(1);
      expect(res[0].count).toStrictEqual(6);
    });
  });

  describe("test GetMostUsed", () => {
    beforeEach(async () => {
      await EnsureDB(conn);
      await conn(FizzStats.TableName).delete();
    });

    test("no lines", async () => {
      const s = new FizzStats(conn);
      const res = await s.GetMostUsed();

      expect(isError(res));
      expect(res.error).toBe("no stat set");
    });
  });

  afterAll(async () => {
    await conn.destroy();
  });
});
