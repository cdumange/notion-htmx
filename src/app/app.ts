import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as KoaPug from 'koa-pug'

const Pug = require('koa-pug')
const path = require('path')

import { registerFizzbuzz } from "../routing/fizzbuzz";
import { FizzBuzz } from "../usecases/fizzbuzz/fizzbuzz";
import { InMemoryStatManager } from "../usecases/stats";
import { registerStats } from "../routing/stats";
import Router = require("koa-router");

const app: Koa = new Koa();
app.use(bodyParser());

new Pug({
        viewPath: path.resolve(__dirname, '../pages'),
    helperPath: [
      { _: require('lodash') }
    ],
    app: app,
  })

const statManager = new InMemoryStatManager();

registerFizzbuzz(app, FizzBuzz, statManager);
registerStats(app, statManager);

var r =  new Router()
r.get("", async (ctx) => {
    await ctx.render('index')
})

app.use(r.routes())

app.on("error", console.error);


export default app;
