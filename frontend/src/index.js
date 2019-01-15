import http from "http";

let app = require("./server").default;

// bypass webpack.DefinePlugin as we need to read port during runtime,
// but webpack already hard-codes it during build-time
const { env } = require("process");
const port = env.PORT || 3000;

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

server.listen(port, error => {
  if (error) {
    console.log(error);
  }

  console.log("🚀 started");
});

if (module.hot) {
  console.log("✅  Server-side HMR Enabled!");

  module.hot.accept("./server", () => {
    console.log("🔁  HMR Reloading `./server`...");

    try {
      const newHandler = require("./server").default.callback();
      server.removeListener("request", currentHandler);
      server.on("request", newHandler);
      currentHandler = newHandler;
    } catch (error) {
      console.error(error);
    }
  });
}
