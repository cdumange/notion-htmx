"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eitherValue = exports.isValue = exports.isError = exports.makeError = exports.makeValue = void 0;
function makeValue(value) {
    return {
        value: value,
    };
}
exports.makeValue = makeValue;
function makeError(error) {
    return {
        error: error,
    };
}
exports.makeError = makeError;
function isError(either) {
    return either.error != undefined;
}
exports.isError = isError;
function isValue(either) {
    return either.value != undefined;
}
exports.isValue = isValue;
function eitherValue(either) {
    if (either.value == null && either.error == null) {
        throw new Error("received an empty either");
    }
    if (isError(either)) {
        return either.error;
    }
    if (isValue(either)) {
        return either.value;
    }
    throw new Error("something weird happened with " + JSON.stringify(either));
}
exports.eitherValue = eitherValue;
//# sourceMappingURL=either.js.map