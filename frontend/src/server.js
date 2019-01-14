import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import Koa from "koa";
import { renderToString } from "react-dom/server";
import serve from "koa-static";
import Router from "koa-router";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get(
  "/*",
  async (ctx, next) => {
    const routingContext = {};

    const markup = renderToString(
      <StaticRouter context={routingContext} location={ctx.url}>
        <App />
      </StaticRouter>
    );

    ctx.state.markup = markup;

    return routingContext.url ? ctx.redirect(routingContext.url) : next();
  },
  ctx => {
    ctx.status = 200;
    ctx.body = `
    <!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Welcome to Razzle + Koa</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${
            process.env.NODE_ENV === "production"
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
          <!-- Render the style tags gathered from the components into the DOM -->
          ${ctx.state.styleTags}
      </head>
      <body>
          <div id="root">${ctx.state.markup}</div>
          <script>window.GRAPHQL_ENDPOINT = "${
            process.env.GRAPHQL_ENDPOINT
          }";</script> 
      </body>
    </html>`;
  }
);

// Intialize and configure Koa application
const server = new Koa();
server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  // .use(helmet())
  // .use(cookie())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
