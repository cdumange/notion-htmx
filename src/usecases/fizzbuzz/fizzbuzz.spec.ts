import { eitherValue, isError } from "../../models/either";
import { FizzbuzzResponse, FizzBuzzErrors } from "../../models/fizzbuzz";
import { FizzBuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  describe("ok cases", () => {
    it.each`
      int1 | int2 | str1      | str2      | limit | expected
      ${3} | ${5} | ${"fizz"} | ${"buzz"} | ${10} | ${["1", "2", "fizz", "4", "buzz", "fizz", "7", "8", "fizz", "buzz"]}
      ${3} | ${5} | ${"fizz"} | ${"buzz"} | ${15} | ${["1", "2", "fizz", "4", "buzz", "fizz", "7", "8", "fizz", "buzz", "11", "fizz", "13", "14", "fizzbuzz"]}
      ${3} | ${5} | ${"fizz"} | ${"buzz"} | ${0}  | ${[]}
    `("empty", ({ int1, int2, str1, str2, limit, expected }): void => {
      const v = FizzBuzz({
        int1: parseInt(int1),
        int2: parseInt(int2),
        str1: str1,
        str2: str2,
        limit: parseInt(limit),
      });
      expect(isError(v)).toBe(false);

      const r = eitherValue(v) as FizzbuzzResponse;
      expect(r.result).toStrictEqual(expected);
    });
  });

  describe("one of divisible is 0", () => {
    it.each`
      int1 | int2 | str1      | str2      | limit | expected
      ${0} | ${5} | ${"fizz"} | ${"buzz"} | ${10} | ${"INTs can't be <= 0"}
      ${3} | ${0} | ${"fizz"} | ${"buzz"} | ${15} | ${"INTs can't be <= 0"}
      ${0} | ${0} | ${"fizz"} | ${"buzz"} | ${0}  | ${"INTs can't be <= 0"}
    `("empty", ({ int1, int2, str1, str2, limit, expected }): void => {
      const v = FizzBuzz({
        int1: parseInt(int1),
        int2: parseInt(int2),
        str1: str1,
        str2: str2,
        limit: parseInt(limit),
      });
      expect(isError(v)).toBe(true);

      const r = eitherValue(v) as FizzBuzzErrors;
      expect(r).toStrictEqual(expected);
    });
  });

  test("limit too great", () => {
    const v = FizzBuzz({
      int1: 3,
      int2: 5,
      limit: 1000000000,
      str1: "fizz",
      str2: "buzz",
    });

    expect(isError(v)).toBe(true);
    const r = eitherValue(v) as FizzBuzzErrors;
    expect(r).toStrictEqual("limit is too great");
  });
});
