import { makeError, makeValue, isError, isValue, eitherValue } from "./either";

describe("test either", () => {
  test("value", () => {
    const v = makeValue("one two three");
    expect(v.value).toBe("one two three");
    expect(v.error).toBe(undefined);

    expect(isError(v)).toBe(false);
    expect(isValue(v)).toBe(true);
    expect(eitherValue(v)).toBe("one two three");
  });

  test("error", () => {
    const v = makeError("one two three");
    expect(v.error).toBe("one two three");
    expect(v.value).toBe(undefined);

    expect(isError(v)).toBe(true);
    expect(isValue(v)).toBe(false);
    expect(eitherValue(v)).toBe("one two three");
  });
});
