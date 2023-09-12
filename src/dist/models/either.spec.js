"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either_1 = require("./either");
describe("test either", () => {
    test("value", () => {
        const v = (0, either_1.makeValue)("one two three");
        expect(v.value).toBe("one two three");
        expect(v.error).toBe(undefined);
        expect((0, either_1.isError)(v)).toBe(false);
        expect((0, either_1.isValue)(v)).toBe(true);
        expect((0, either_1.eitherValue)(v)).toBe("one two three");
    });
    test("error", () => {
        const v = (0, either_1.makeError)("one two three");
        expect(v.error).toBe("one two three");
        expect(v.value).toBe(undefined);
        expect((0, either_1.isError)(v)).toBe(true);
        expect((0, either_1.isValue)(v)).toBe(false);
        expect((0, either_1.eitherValue)(v)).toBe("one two three");
    });
});
//# sourceMappingURL=either.spec.js.map