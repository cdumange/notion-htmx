"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStatManager = void 0;
const models_1 = require("../../models");
class InMemoryStatManager {
    constructor() {
        this.max = 0;
        this.stats = new Map();
    }
    Increment(request) {
        const req = JSON.stringify(request);
        let s = this.stats.get(req);
        if (s === undefined) {
            s = {
                request: request,
                count: 0,
            };
        }
        s.count++;
        if (s.count > this.max) {
            this.max = s.count;
            this.maxRequest = s.request;
        }
        this.stats.set(req, s);
        return new Promise((resolve) => {
            resolve();
        });
    }
    GetStat(request) {
        return new Promise((resolve) => {
            const s = this.stats.get(JSON.stringify(request));
            if (s === undefined) {
                resolve((0, models_1.makeError)("no stat set"));
                return;
            }
            resolve((0, models_1.makeValue)(JSON.parse(JSON.stringify(s))));
        });
    }
    GetMostUsed() {
        return new Promise((resolve) => {
            if (this.max == 0 || this.maxRequest === undefined) {
                resolve((0, models_1.makeError)("no stat set"));
                return;
            }
            const stat = this.stats.get(JSON.stringify(this.maxRequest));
            resolve((0, models_1.makeValue)(JSON.parse(JSON.stringify(stat))));
        });
    }
}
exports.InMemoryStatManager = InMemoryStatManager;
//# sourceMappingURL=inmemory.js.map