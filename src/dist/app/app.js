"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const KoaPug = require("koa-pug");
const KoaStatic = require("koa-static");
const path = require('path');
const fizzbuzz_1 = require("../routing/fizzbuzz");
const fizzbuzz_2 = require("../usecases/fizzbuzz/fizzbuzz");
const stats_1 = require("../usecases/stats");
const stats_2 = require("../routing/stats");
const Router = require("koa-router");
const app = new Koa();
app.use(bodyParser());
app.use(KoaStatic(path.resolve(__dirname, '../../dist')));
new KoaPug.KoaPug({
    viewPath: path.resolve(__dirname, '../pages'),
    helperPath: [
        { _: require('lodash') }
    ],
    app: app,
});
const statManager = new stats_1.InMemoryStatManager();
(0, fizzbuzz_1.registerFizzbuzz)(app, fizzbuzz_2.FizzBuzz, statManager);
(0, stats_2.registerStats)(app, statManager);
var r = new Router();
r.get("", async (ctx) => {
    await ctx.render('index');
});
app.use(r.routes());
app.on("error", console.error);
exports.default = app;
//# sourceMappingURL=app.js.map