import app from "./app/app";
import * as http from "http";

const server = http.createServer(app.callback());

const controller = new AbortController();
const defaultPort = 3000;

const PORT: number = Number(process.env.PORT) || defaultPort;
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
