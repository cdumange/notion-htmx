"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsureDB = void 0;
const FizzStats_1 = require("./FizzStats");
async function EnsureDB(conn) {
    const migrations = [new FizzStats_1.FizzStats(conn)];
    return await Promise.all(migrations.map(async (x) => await x.Migrate()));
}
exports.EnsureDB = EnsureDB;
//# sourceMappingURL=migrations.js.map