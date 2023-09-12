import { isError, isValue } from "../../models";
import { FizzbuzzRequest } from "../../models/fizzbuzz";
import { InMemoryStatManager } from "./inmemory";

describe("test inmemory stats", () => {
  describe("test increment", () => {
    it("ok", async () => {
      const s = new InMemoryStatManager();
      const request: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };

      expect(async function () {
        await s.Increment(request);
      }).not.toThrowError();

      let v = await s.GetStat(request);
      expect(isValue(v)).toBe(true);
      expect(v.value.count).toBe(1);

      expect(async function () {
        await s.Increment(request);
      }).not.toThrowError();

      v = await s.GetStat(request);
      expect(isValue(v)).toBe(true);
      expect(v.value.count).toBe(2);
    });
  });

  describe("test getstat", () => {
    it("ok", async () => {
      const s = new InMemoryStatManager();
      const request: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };

      expect(async function () {
        await s.Increment(request);
      }).not.toThrowError();

      const v = await s.GetStat(request);
      expect(isValue(v));
      expect(v.value.count).toBe(1);
    });

    it("not set", async () => {
      const s = new InMemoryStatManager();
      const request: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };

      const v = await s.GetStat(request);
      expect(isError(v));
      expect(v.error).toBe("no stat set");
    });
  });

  describe("GetMostUsed", () => {
    it("no stat set", async () => {
      const s = new InMemoryStatManager();

      const v = await s.GetMostUsed();
      expect(isError(v));
      expect(v.error).toBe("no stat set");
    });

    it("ok", async () => {
      const s = new InMemoryStatManager();

      const req1: FizzbuzzRequest = {
        int1: 0,
        int2: 0,
        str1: "",
        str2: "",
        limit: 0,
      };
      const req2: FizzbuzzRequest = {
        int1: 3,
        int2: 5,
        str1: "",
        str2: "",
        limit: 0,
      };

      const expectedCount = 2;

      await s.Increment(req1);
      await s.Increment(req1);

      await s.Increment(req2);

      const v = await s.GetMostUsed();
      expect(isValue(v));
      expect(v.value.request).toStrictEqual(req1);
      expect(v.value.count).toStrictEqual(expectedCount);
    });
  });
});
