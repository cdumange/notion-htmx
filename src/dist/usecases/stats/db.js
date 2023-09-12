"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBStatManager = void 0;
class DBStatManager {
    constructor(dbRepo) {
        this.db = dbRepo;
    }
    Increment(request) {
        return this.db.UpsertRequest({
            request: request,
            count: 1,
        });
    }
    GetMostUsed() {
        return this.db.GetMostUsed();
    }
}
exports.DBStatManager = DBStatManager;
//# sourceMappingURL=db.js.map