"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app/app");
const http = require("http");
const server = http.createServer(app_1.default.callback());
const controller = new AbortController();
const defaultPort = 3000;
const PORT = Number(process.env.PORT) || defaultPort;
console.log("serving on", PORT);
server.listen({
    host: "0.0.0.0",
    port: PORT,
    signal: controller.signal,
});
process.on("SIGINT", () => {
    console.log("shutting down");
    controller.abort();
});
//# sourceMappingURL=server.js.map