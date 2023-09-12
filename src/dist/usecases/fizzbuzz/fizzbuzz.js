"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FizzBuzz = void 0;
const either_1 = require("../../models/either");
const MAX_LIMIT = 100000;
function FizzBuzz(input) {
    const valid = validateInput(input);
    if (valid != null) {
        return (0, either_1.makeError)(valid);
    }
    return (0, either_1.makeValue)(doFizzbuzz(input));
}
exports.FizzBuzz = FizzBuzz;
function doFizzbuzz(input) {
    const ret = [];
    for (let n = 1; n <= input.limit; n++) {
        const mod1 = n % input.int1, mod2 = n % input.int2;
        if (mod1 == 0 && mod2 == 0) {
            ret.push(input.str1 + input.str2);
            continue;
        }
        if (mod1 == 0) {
            ret.push(input.str1);
            continue;
        }
        if (mod2 == 0) {
            ret.push(input.str2);
            continue;
        }
        ret.push(n.toString());
    }
    return {
        result: ret,
    };
}
function validateInput(input) {
    if (input.int1 <= 0 || input.int2 <= 0) {
        return "INTs can't be <= 0";
    }
    if (input.limit > MAX_LIMIT) {
        return "limit is too great";
    }
    return null;
}
//# sourceMappingURL=fizzbuzz.js.map